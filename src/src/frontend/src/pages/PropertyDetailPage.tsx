import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useGetProperty, useDeleteProperty } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import ImageGallery from '../components/ImageGallery';
import { MapPin, Bed, Bath, Square, Calendar, Phone, Mail, Edit, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { formatPrice, getPropertyTypeLabel, getStatusColor, getStatusLabel, formatDate, formatSquareFeet } from '../utils/propertyHelpers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

export default function PropertyDetailPage() {
  const { id } = useParams({ from: '/property/$id' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const propertyId = id ? BigInt(id) : null;
  const { data: property, isLoading } = useGetProperty(propertyId);
  const deleteProperty = useDeleteProperty();

  const isOwner = property && identity && property.owner.toString() === identity.getPrincipal().toString();

  const handleDelete = async () => {
    if (!propertyId) return;
    deleteProperty.mutate(propertyId, {
      onSuccess: () => {
        navigate({ to: '/my-listings' });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/properties">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {property.images && property.images.length > 0 && (
              <ImageGallery images={property.images} />
            )}

            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(property.status)}>
                      {getStatusLabel(property.status)}
                    </Badge>
                    <Badge variant="secondary">{getPropertyTypeLabel(property.propertyType)}</Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-3">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{property.location.area}, {property.location.city}</span>
                  </div>
                  <p className="text-3xl md:text-4xl font-serif font-bold text-primary">{formatPrice(property.price)}</p>
                </div>

                {isOwner && (
                  <div className="flex gap-2">
                    <Link to="/edit-property/$id" params={{ id: id! }}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Property</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this property? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary">
                    <Bed className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="text-xl font-semibold">{Number(property.bedrooms)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary">
                    <Bath className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="text-xl font-semibold">{Number(property.bathrooms)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary">
                    <Square className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="text-xl font-semibold">{formatSquareFeet(property.squareFootage)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary">
                    <Calendar className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listed</p>
                    <p className="text-xl font-semibold">{formatDate(property.listingDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{property.description}</p>
              </CardContent>
            </Card>

            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Contact Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Listed by</p>
                  <p className="text-lg font-semibold">{property.sellerContact.name}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Phone className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href={`tel:${property.sellerContact.phone}`} className="font-medium hover:text-primary">
                        {property.sellerContact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Mail className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${property.sellerContact.email}`} className="font-medium hover:text-primary break-all">
                        {property.sellerContact.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <Button className="w-full" size="lg" asChild>
                    <a href={`tel:${property.sellerContact.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <a href={`mailto:${property.sellerContact.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
