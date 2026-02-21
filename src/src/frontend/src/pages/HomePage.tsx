import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Building2, Search, Heart } from 'lucide-react';
import { useGetAvailableProperties } from '../hooks/useQueries';
import PropertyCard from '../components/PropertyCard';
import { Skeleton } from '../components/ui/skeleton';
import { useState } from 'react';

export default function HomePage() {
  const { data: properties, isLoading } = useGetAvailableProperties();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProperties = properties?.slice(0, 6) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/properties?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-background via-secondary/20 to-accent/10 py-20 md:py-32 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-tight">
              Find Your Dream Home
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Discover the perfect property that matches your lifestyle and aspirations
            </p>

            <form onSubmit={handleSearch} className="mt-8">
              <div className="flex gap-2 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by city, area, or property type..."
                    className="pl-10 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-8">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-serif font-semibold mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Explore our handpicked selection</p>
            </div>
            <Link to="/properties">
              <Button variant="outline">View All Properties</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {featuredProperties.map((property, index) => (
                <PropertyCard key={index} property={property} propertyId={BigInt(index)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No properties available yet</p>
              <Link to="/post-property">
                <Button className="mt-4">List Your Property</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            © 2026. Built with <Heart className="h-4 w-4 text-primary fill-primary" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
