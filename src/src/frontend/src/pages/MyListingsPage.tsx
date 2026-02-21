import { Link } from '@tanstack/react-router';
import { useGetPropertiesByOwner } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PropertyCard from '../components/PropertyCard';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Building2, PlusCircle } from 'lucide-react';

export default function MyListingsPage() {
  const { identity } = useInternetIdentity();
  const { data: properties, isLoading } = useGetPropertiesByOwner();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-serif mb-4">Login Required</h2>
        <p className="text-muted-foreground">You need to login to view your listings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-2">My Listings</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Link to="/post-property">
            <Button size="lg">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {properties.map((property, index) => (
              <PropertyCard key={index} property={property} propertyId={BigInt(index)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">No properties listed yet</p>
            <p className="text-sm text-muted-foreground mb-6">Start by adding your first property</p>
            <Link to="/post-property">
              <Button size="lg">
                <PlusCircle className="h-5 w-5 mr-2" />
                Post Your First Property
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
