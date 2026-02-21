import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PropertyDetails {
    status: PropertyStatus;
    title: string;
    propertyType: PropertyType;
    bedrooms: bigint;
    owner: Principal;
    createdAt: Time;
    sellerContact: {
        name: string;
        email: string;
        phone: string;
    };
    description: string;
    amenities: Array<string>;
    listingDate: Time;
    updatedAt: Time;
    squareFootage: bigint;
    bathrooms: bigint;
    price: bigint;
    location: {
        area: string;
        city: string;
    };
    images: Array<ExternalBlob>;
}
export type Time = bigint;
export type PropertyId = bigint;
export interface PropertySearchCriteria {
    status?: PropertyStatus;
    propertyType?: PropertyType;
    area?: string;
    city?: string;
    minBedrooms?: bigint;
    maxPrice?: bigint;
    minPrice?: bigint;
    minBathrooms?: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum PropertyStatus {
    pending = "pending",
    sold = "sold",
    available = "available"
}
export enum PropertyType {
    house = "house",
    villa = "villa",
    plot = "plot",
    apartment = "apartment"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProperty(details: PropertyDetails): Promise<PropertyId>;
    deleteProperty(id: PropertyId): Promise<void>;
    getAllProperties(): Promise<Array<PropertyDetails>>;
    getAvailableProperties(): Promise<Array<PropertyDetails>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPropertiesByOwner(owner: Principal): Promise<Array<PropertyDetails>>;
    getProperty(id: PropertyId): Promise<PropertyDetails>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProperties(criteria: PropertySearchCriteria | null): Promise<Array<PropertyDetails>>;
    updateProperty(id: PropertyId, updatedDetails: PropertyDetails): Promise<void>;
}
