import { Link } from '@tanstack/react-router';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import type { PropertyDetails } from '../backend';
import { formatPrice, getPropertyTypeLabel, getStatusColor, getStatusLabel, formatSquareFeet } from '../utils/propertyHelpers';
import { useState, useEffect } from 'react';

interface PropertyCardProps {
  property: PropertyDetails;
  propertyId: bigint;
}

export default function PropertyCard({ property, propertyId }: PropertyCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (property.images && property.images.length > 0) {
      const url = property.images[0].getDirectURL();
      setImageUrl(url);
    }
  }, [property.images]);

  return (
    <Link
      to="/property/$id"
      params={{ id: propertyId.toString() }}
      className="group block"
    >
      <Card className="overflow-hidden border border-border hover:shadow-lift transition-all duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Square className="h-16 w-16" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={getStatusColor(property.status)}>
              {getStatusLabel(property.status)}
            </Badge>
            <Badge variant="secondary" className="bg-card/90 backdrop-blur">
              {getPropertyTypeLabel(property.propertyType)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5 space-y-3">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1 shrink-0" />
              <span className="line-clamp-1">{property.location.area}, {property.location.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-foreground/70">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{Number(property.bedrooms)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{Number(property.bathrooms)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{formatSquareFeet(property.squareFootage)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-2xl font-serif font-semibold text-primary">
              {formatPrice(property.price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
