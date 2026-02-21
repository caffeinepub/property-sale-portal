import { useNavigate } from '@tanstack/react-router';
import PropertyForm from '../components/PropertyForm';
import { useCreateProperty } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { LogIn } from 'lucide-react';

export default function PostPropertyPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createProperty = useCreateProperty();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-serif mb-4">Login Required</h2>
        <p className="text-muted-foreground mb-6">You need to login to post a property</p>
        <Button size="lg">
          <LogIn className="h-5 w-5 mr-2" />
          Login to Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-2">Post a Property</h1>
            <p className="text-muted-foreground">List your property and reach thousands of potential buyers</p>
          </div>

          <PropertyForm
            mode="create"
            onSubmit={(data) => {
              createProperty.mutate(data, {
                onSuccess: () => {
                  navigate({ to: '/my-listings' });
                },
              });
            }}
            isPending={createProperty.isPending}
          />
        </div>
      </div>
    </div>
  );
}
