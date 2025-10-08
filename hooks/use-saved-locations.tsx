import {
  createSavedLocation,
  CreateSavedLocationParams,
  deleteSavedLocation,
  getSavedLocations,
  updateSavedLocation,
  UpdateSavedLocationParams,
} from "@/services/address/saved-locations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useGetUserInfo from "./use-get-user-info";

export default function useSavedLocations() {
  const { data: user } = useGetUserInfo();
  const queryClient = useQueryClient();

  // Get all saved locations
  const {
    data: savedLocations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["saved-locations"],
    queryFn: () => getSavedLocations(user?.token || ""),
    enabled: !!user?.token,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (params: Omit<CreateSavedLocationParams, "token">) =>
      createSavedLocation({ ...params, token: user?.token || "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-locations"] });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (params: Omit<UpdateSavedLocationParams, "token">) =>
      updateSavedLocation({ ...params, token: user?.token || "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-locations"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSavedLocation(id, user?.token || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-locations"] });
    },
  });

  // Helper function to get location by type
  const getLocationByType = (type: "HOME" | "WORK" | "OTHER") => {
    return savedLocations?.data?.find((loc) => loc.type === type);
  };

  return {
    savedLocations: savedLocations?.data || [],
    isLoading,
    error,
    createLocation: createMutation.mutateAsync,
    updateLocation: updateMutation.mutateAsync,
    // deleteLocation: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    // isDeleting: deleteMutation.isPending,
    getLocationByType,
  };
}
