# Property Sale Portal

## Current State

This is a new Caffeine project with:
- Basic React + TypeScript setup with Vite
- Internet Identity authentication configured
- Tailwind CSS and shadcn/ui components available
- Query client for data fetching
- No App.tsx file yet (referenced in main.tsx but not created)
- No backend logic or data models

## Requested Changes (Diff)

### Add

**Backend:**
- Property data model with fields: title, description, price, location (city, area), property type (apartment/house/villa), bedrooms, bathrooms, square footage, amenities, images (URLs), seller contact info, listing date, status (available/sold)
- CRUD operations for properties (create, read, update, delete)
- Search and filter functionality by price range, location, property type, bedrooms
- User authentication integration for listing management

**Frontend:**
- Home page with featured properties grid
- Property listing page with search/filter sidebar (price range, location, property type, bedrooms)
- Individual property detail page with image gallery, specifications, description, contact form
- "Post Property" page (authenticated) with form to create new listings
- "My Listings" page (authenticated) to manage user's properties
- Navigation header with authentication status and links
- Responsive design for mobile and desktop
- Property cards with image, price, location, key specs

**Features:**
- Anonymous users can browse and search properties
- Authenticated users can post properties, edit their listings, and delete them
- Image upload support for property photos
- Contact seller functionality
- Price formatting with currency
- Property status badges (new, featured, sold)

### Modify

- None (new application)

### Remove

- None (new application)

## Implementation Plan

1. **Select Caffeine components:**
   - `authorization` for user role management and listing ownership
   - `blob-storage` for property image uploads

2. **Backend generation:**
   - Create Property data type with all required fields
   - Implement createProperty, getProperty, getAllProperties, updateProperty, deleteProperty
   - Implement searchProperties with filters (price, location, type, bedrooms)
   - Implement getUserProperties to fetch listings by owner
   - Integrate authorization to control property management

3. **Frontend development:**
   - Create App.tsx with routing (home, listings, property detail, post property, my listings)
   - Build HomePage component with featured properties grid
   - Build PropertyListings component with sidebar filters and property cards
   - Build PropertyDetail component with full specs, image gallery, contact section
   - Build PostProperty component with form and image upload
   - Build MyListings component to manage user's properties
   - Create reusable PropertyCard component
   - Create SearchFilters component for sidebar
   - Wire all components to backend APIs
   - Add loading states and error handling
   - Implement responsive layouts

## UX Notes

- **Visual hierarchy:** Large property images with clear pricing and location
- **Search-first:** Prominent search and filter controls on listings page
- **Mobile-friendly:** Stack filters above results on mobile, grid adapts to screen size
- **Trust indicators:** Show listing date, verified badges where applicable
- **Quick actions:** Clear CTAs (View Details, Contact Seller, Edit/Delete for owners)
- **Image gallery:** Swipeable carousel on property detail page
- **Form validation:** Real-time validation on property posting form
- **Loading states:** Skeleton loaders for property cards while fetching
