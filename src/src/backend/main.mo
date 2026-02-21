import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Mixin modules
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextPropertyId = 0;

  // Data Structures
  type PropertyId = Nat;

  public type PropertyStatus = {
    #available;
    #sold;
    #pending;
  };

  public type PropertyType = {
    #apartment;
    #house;
    #villa;
    #plot;
  };

  public type PropertyDetails = {
    title : Text;
    description : Text;
    price : Nat;
    location : {
      city : Text;
      area : Text;
    };
    propertyType : PropertyType;
    bedrooms : Nat;
    bathrooms : Nat;
    squareFootage : Nat;
    amenities : [Text];
    images : [Storage.ExternalBlob];
    sellerContact : {
      name : Text;
      phone : Text;
      email : Text;
    };
    listingDate : Time.Time;
    status : PropertyStatus;
    owner : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type PropertySearchCriteria = {
    minPrice : ?Nat;
    maxPrice : ?Nat;
    city : ?Text;
    area : ?Text;
    propertyType : ?PropertyType;
    minBedrooms : ?Nat;
    minBathrooms : ?Nat;
    status : ?PropertyStatus;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
  };

  module PropertyDetails {
    public func compareByListingDateAsc(p1 : PropertyDetails, p2 : PropertyDetails) : Order.Order {
      if (p1.listingDate < p2.listingDate) {
        #less;
      } else if (p1.listingDate > p2.listingDate) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByListingDateDesc(p1 : PropertyDetails, p2 : PropertyDetails) : Order.Order {
      if (p1.listingDate > p2.listingDate) {
        #less;
      } else if (p1.listingDate < p2.listingDate) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  // Storage BTree
  let properties = Map.empty<PropertyId, PropertyDetails>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Core Functions

  // Retrieve property by ID (public access)
  public query func getProperty(id : PropertyId) : async PropertyDetails {
    switch (properties.get(id)) {
      case (null) {
        Runtime.trap("Property not found");
      };
      case (?property) {
        property;
      };
    };
  };

  // Retrieve all available properties (public access)
  public query func getAvailableProperties() : async [PropertyDetails] {
    let available = List.empty<PropertyDetails>();

    for (p in properties.values()) {
      switch (p.status) {
        case (#available) {
          available.add(p);
        };
        case (_) {};
      };
    };

    available.toArray().sort(PropertyDetails.compareByListingDateDesc);
  };

  // Get properties by owner (authenticated, owner or admin only)
  public query ({ caller }) func getPropertiesByOwner(owner : Principal) : async [PropertyDetails] {
    // Authorization: Only the owner or admin can access this
    if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own properties");
    };

    let owned = List.empty<PropertyDetails>();

    for (prop in properties.values()) {
      if (prop.owner == owner) {
        owned.add(prop);
      };
    };

    owned.toArray().sort(PropertyDetails.compareByListingDateDesc);
  };

  // Create new property (authenticated users only)
  public shared ({ caller }) func createProperty(details : PropertyDetails) : async PropertyId {
    // Authenticated users only (not guests)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create properties");
    };

    let currentTime = Time.now();
    let propertyId = nextPropertyId;

    let property : PropertyDetails = {
      details with
      owner = caller;
      createdAt = currentTime;
      updatedAt = currentTime;
      listingDate = currentTime;
    };

    properties.add(propertyId, property);
    nextPropertyId += 1;
    propertyId;
  };

  // Update property (owner or admin only)
  public shared ({ caller }) func updateProperty(id : PropertyId, updatedDetails : PropertyDetails) : async () {
    // Retrieve existing property
    let existing = switch (properties.get(id)) {
      case (null) {
        Runtime.trap("Property not found");
      };
      case (?prop) { prop };
    };

    // Only owner or admin can update
    if (caller != existing.owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only owner can update property");
    };

    let currentTime = Time.now();

    let updated = {
      updatedDetails with
      owner = existing.owner;
      createdAt = existing.createdAt;
      updatedAt = currentTime;
      listingDate = existing.listingDate;
    };

    properties.add(id, updated);
  };

  // Delete property (owner or admin only)
  public shared ({ caller }) func deleteProperty(id : PropertyId) : async () {
    // Only owner or admin can delete
    let existing = switch (properties.get(id)) {
      case (null) {
        Runtime.trap("Property not found");
      };
      case (?prop) { prop };
    };

    if (caller != existing.owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only owner can delete property");
    };

    properties.remove(id);
  };

  // Search Properties (public access)
  public query func searchProperties(criteria : ?PropertySearchCriteria) : async [PropertyDetails] {
    let results = List.empty<PropertyDetails>();

    let matchesCriteria = func(property : PropertyDetails) : Bool {
      switch (criteria) {
        case (null) { true };
        case (?c) {
          let priceMatch = switch (c.minPrice, c.maxPrice) {
            case (null, null) { true };
            case (?min, null) { property.price >= min };
            case (null, ?max) { property.price <= max };
            case (?min, ?max) {
              property.price >= min and property.price <= max
            };
          };

          let cityMatch = switch (c.city) {
            case (null) { true };
            case (?city) { property.location.city.contains(#text city) };
          };

          let areaMatch = switch (c.area) {
            case (null) { true };
            case (?area) { property.location.area.contains(#text area) };
          };

          let typeMatch = switch (c.propertyType) {
            case (null) { true };
            case (?t) { property.propertyType == t };
          };

          let bedroomMatch = switch (c.minBedrooms) {
            case (null) { true };
            case (?minB) { property.bedrooms >= minB };
          };

          let bathroomMatch = switch (c.minBathrooms) {
            case (null) { true };
            case (?min) { property.bathrooms >= min };
          };

          let statusMatch = switch (c.status) {
            case (null) { true };
            case (?s) { property.status == s };
          };

          priceMatch and cityMatch and areaMatch and typeMatch and bedroomMatch and bathroomMatch and statusMatch
        };
      };
    };

    for (p in properties.values()) {
      if (matchesCriteria(p)) {
        results.add(p);
      };
    };

    results.toArray().sort(PropertyDetails.compareByListingDateDesc);
  };

  // Get all properties (admin-only)
  public query ({ caller }) func getAllProperties() : async [PropertyDetails] {
    // Admin-only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all properties");
    };

    properties.values().toArray();
  };
};
