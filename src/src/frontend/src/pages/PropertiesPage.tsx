import { useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import SearchFilters from '../components/SearchFilters';
import { Skeleton } from '../components/ui/skeleton';
import { Building2 } from 'lucide-react';
import { useSearchProperties } from '../hooks/useQueries';
import type { PropertySearchCriteria } from '../backend';

export default function PropertiesPage() {
  const [searchCriteria, setSearchCriteria] = useState<PropertySearchCriteria | null>(null);
  const { data: properties, isLoading } = useSearchProperties(searchCriteria);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-2">Browse Properties</h1>
          <p className="text-muted-foreground">Find your perfect home from our extensive listings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <SearchFilters onSearch={setSearchCriteria} />
          </aside>

          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : properties && properties.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Found {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {properties.map((property, index) => (
                    <PropertyCard key={index} property={property} propertyId={BigInt(index)} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-2">No properties found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search filters</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
