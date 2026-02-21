import type { PropertyStatus, PropertyType } from '../backend';

export function formatPrice(price: bigint): string {
  const num = Number(price);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

export function getPropertyTypeLabel(type: PropertyType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getStatusColor(status: PropertyStatus): string {
  switch (status) {
    case 'available':
      return 'bg-accent text-accent-foreground';
    case 'sold':
      return 'bg-muted text-muted-foreground';
    case 'pending':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getStatusLabel(status: PropertyStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatSquareFeet(sqft: bigint): string {
  return `${Number(sqft).toLocaleString('en-IN')} sq ft`;
}
