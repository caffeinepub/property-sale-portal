import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';
import type { PropertyDetails, PropertyId, PropertySearchCriteria, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Property Queries
export function useGetAllProperties() {
  const { actor, isFetching } = useActor();

  return useQuery<PropertyDetails[]>({
    queryKey: ['properties', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProperties();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableProperties() {
  const { actor, isFetching } = useActor();

  return useQuery<PropertyDetails[]>({
    queryKey: ['properties', 'available'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableProperties();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProperty(id: PropertyId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PropertyDetails | null>({
    queryKey: ['property', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        return await actor.getProperty(id);
      } catch (error) {
        console.error('Error fetching property:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetPropertiesByOwner() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<PropertyDetails[]>({
    queryKey: ['properties', 'myListings', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      return actor.getPropertiesByOwner(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSearchProperties(criteria: PropertySearchCriteria | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PropertyDetails[]>({
    queryKey: ['properties', 'search', JSON.stringify(criteria)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProperties(criteria);
    },
    enabled: !!actor && !isFetching,
  });
}

// Property Mutations
export function useCreateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: PropertyDetails) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.createProperty(details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property listed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create property: ${error.message}`);
    },
  });
}

export function useUpdateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, details }: { id: PropertyId; details: PropertyDetails }) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.updateProperty(id, details);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.id.toString()] });
      toast.success('Property updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update property: ${error.message}`);
    },
  });
}

export function useDeleteProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: PropertyId) => {
      if (!actor) throw new Error('Not authenticated');
      return actor.deleteProperty(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete property: ${error.message}`);
    },
  });
}
