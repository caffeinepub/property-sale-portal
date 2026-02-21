import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { PropertyType, PropertyStatus, PropertySearchCriteria } from '../backend';
import { formatPrice } from '../utils/propertyHelpers';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (criteria: PropertySearchCriteria | null) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [status, setStatus] = useState<PropertyStatus | ''>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [minBedrooms, setMinBedrooms] = useState<string>('');
  const [minBathrooms, setMinBathrooms] = useState<string>('');

  const handleSearch = () => {
    const criteria: PropertySearchCriteria = {};
    
    if (city.trim()) criteria.city = city.trim();
    if (area.trim()) criteria.area = area.trim();
    if (propertyType) criteria.propertyType = propertyType;
    if (status) criteria.status = status;
    if (minPrice > 0) criteria.minPrice = BigInt(minPrice);
    if (maxPrice < 100000000) criteria.maxPrice = BigInt(maxPrice);
    if (minBedrooms) criteria.minBedrooms = BigInt(minBedrooms);
    if (minBathrooms) criteria.minBathrooms = BigInt(minBathrooms);

    onSearch(Object.keys(criteria).length > 0 ? criteria : null);
  };

  const handleReset = () => {
    setCity('');
    setArea('');
    setPropertyType('');
    setStatus('');
    setMinPrice(0);
    setMaxPrice(100000000);
    setMinBedrooms('');
    setMinBathrooms('');
    onSearch(null);
  };

  const hasFilters = city || area || propertyType || status || minPrice > 0 || maxPrice < 100000000 || minBedrooms || minBathrooms;

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-serif">
          <Search className="h-5 w-5" />
          Search Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g., Mumbai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Area</Label>
          <Input
            id="area"
            placeholder="e.g., Bandra"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select value={propertyType} onValueChange={(v) => setPropertyType(v as PropertyType | '')}>
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any type</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="plot">Plot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as PropertyStatus | '')}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Price Range</Label>
          <Slider
            min={0}
            max={100000000}
            step={1000000}
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            className="py-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(BigInt(minPrice))}</span>
            <span>{formatPrice(BigInt(maxPrice))}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minBedrooms">Min Bedrooms</Label>
          <Select value={minBedrooms} onValueChange={setMinBedrooms}>
            <SelectTrigger id="minBedrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minBathrooms">Min Bathrooms</Label>
          <Select value={minBathrooms} onValueChange={setMinBathrooms}>
            <SelectTrigger id="minBathrooms">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {hasFilters && (
            <Button onClick={handleReset} variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
