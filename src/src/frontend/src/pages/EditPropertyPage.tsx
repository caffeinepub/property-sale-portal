import { useParams, useNavigate } from '@tanstack/react-router';
import PropertyForm from '../components/PropertyForm';
import { useGetProperty, useUpdateProperty } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Link } from '@tanstack/react-router';

export default function EditPropertyPage() {
  const { id } = useParams({ from: '/edit-property/$id' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const propertyId = id ? BigInt(id) : null;
  const { data: property, isLoading } = useGetProperty(propertyId);
  const updateProperty = useUpdateProperty();

  const isOwner = property && identity && property.owner.toString() === identity.getPrincipal().toString();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif mb-4">Property not found</h2>
        <Link to="/properties">
          <Button>Browse Properties</Button>
        </Link>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-serif mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You can only edit your own properties</p>
        <Link to="/properties">
          <Button>Browse Properties</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-2">Edit Property</h1>
            <p className="text-muted-foreground">Update your property listing details</p>
          </div>

          <PropertyForm
            mode="edit"
            initialData={property}
            propertyId={propertyId!}
            onSubmit={(data) => {
              updateProperty.mutate({ id: propertyId!, details: data }, {
                onSuccess: () => {
                  navigate({ to: '/property/$id', params: { id: id! } });
                },
              });
            }}
            isPending={updateProperty.isPending}
          />
        </div>
      </div>
    </div>
  );
}
