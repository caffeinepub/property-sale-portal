import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, X, Loader2 } from 'lucide-react';
import type { PropertyDetails } from '../backend';
import { ExternalBlob, PropertyType, PropertyStatus } from '../backend';

interface PropertyFormProps {
  mode: 'create' | 'edit';
  initialData?: PropertyDetails;
  propertyId?: bigint;
  onSubmit: (data: PropertyDetails) => void;
  isPending?: boolean;
}

export default function PropertyForm({ mode, initialData, propertyId, onSubmit, isPending = false }: PropertyFormProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '');
  const [city, setCity] = useState(initialData?.location.city || '');
  const [area, setArea] = useState(initialData?.location.area || '');
  const [propertyType, setPropertyType] = useState<PropertyType>(initialData?.propertyType || PropertyType.apartment);
  const [status, setStatus] = useState<PropertyStatus>(initialData?.status || PropertyStatus.available);
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms ? String(initialData.bedrooms) : '');
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms ? String(initialData.bathrooms) : '');
  const [squareFootage, setSquareFootage] = useState(initialData?.squareFootage ? String(initialData.squareFootage) : '');
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [amenityInput, setAmenityInput] = useState('');
  const [images, setImages] = useState<ExternalBlob[]>(initialData?.images || []);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [sellerName, setSellerName] = useState(initialData?.sellerContact.name || userProfile?.name || '');
  const [sellerPhone, setSellerPhone] = useState(initialData?.sellerContact.phone || userProfile?.phone || '');
  const [sellerEmail, setSellerEmail] = useState(initialData?.sellerContact.email || userProfile?.email || '');

  useEffect(() => {
    if (userProfile && mode === 'create') {
      setSellerName(userProfile.name);
      setSellerPhone(userProfile.phone);
      setSellerEmail(userProfile.email);
    }
  }, [userProfile, mode]);

  useEffect(() => {
    if (images.length > 0) {
      const urls = images.map(img => img.getDirectURL());
      setImageUrls(urls);
    }
  }, [images]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const newImages: ExternalBlob[] = [];

    for (const file of Array.from(files)) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      newImages.push(blob);
    }

    setImages(prev => [...prev, ...newImages]);
    setUploadingImages(false);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setAmenities(amenities.filter(a => a !== amenity));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      alert('Please login to continue');
      return;
    }

    const propertyData: PropertyDetails = {
      title: title.trim(),
      description: description.trim(),
      price: BigInt(price),
      location: {
        city: city.trim(),
        area: area.trim(),
      },
      propertyType,
      status,
      bedrooms: BigInt(bedrooms),
      bathrooms: BigInt(bathrooms),
      squareFootage: BigInt(squareFootage),
      amenities,
      images,
      sellerContact: {
        name: sellerName.trim(),
        phone: sellerPhone.trim(),
        email: sellerEmail.trim(),
      },
      owner: identity.getPrincipal(),
      listingDate: BigInt(Date.now() * 1000000),
      createdAt: initialData?.createdAt || BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
    };

    onSubmit(propertyData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input id="title" placeholder="e.g., Spacious 3 BHK Apartment" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" placeholder="Describe your property..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR) *</Label>
              <Input id="price" type="number" min="0" placeholder="5000000" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PropertyStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" placeholder="Mumbai" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area *</Label>
              <Input id="area" placeholder="Bandra West" value={area} onChange={(e) => setArea(e.target.value)} required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Property Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type *</Label>
            <Select value={propertyType} onValueChange={(v) => setPropertyType(v as PropertyType)}>
              <SelectTrigger id="propertyType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input id="bedrooms" type="number" min="0" placeholder="3" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input id="bathrooms" type="number" min="0" placeholder="2" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="squareFootage">Area (sq ft) *</Label>
              <Input id="squareFootage" type="number" min="0" placeholder="1500" value={squareFootage} onChange={(e) => setSquareFootage(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities</Label>
            <div className="flex gap-2">
              <Input id="amenities" placeholder="Add amenity" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())} />
              <Button type="button" onClick={handleAddAmenity} variant="outline">Add</Button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                    <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="ml-2"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            <label htmlFor="images" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload images</p>
            </label>
          </div>

          {uploadingImages && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <img src={url} alt={`${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sellerName">Name *</Label>
            <Input id="sellerName" placeholder="Your name" value={sellerName} onChange={(e) => setSellerName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellerPhone">Phone *</Label>
              <Input id="sellerPhone" type="tel" placeholder="+91 98765 43210" value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerEmail">Email *</Label>
              <Input id="sellerEmail" type="email" placeholder="your.email@example.com" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} required />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending || uploadingImages} className="flex-1">
          {isPending ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />{mode === 'create' ? 'Creating...' : 'Updating...'}</>) : (mode === 'create' ? 'Create Listing' : 'Update Listing')}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: mode === 'edit' && propertyId ? `/property/${propertyId}` : '/properties' })}>Cancel</Button>
      </div>
    </form>
  );
}
