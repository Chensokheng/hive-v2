// Types
export type SavedLocationType = "HOME" | "WORK" | "OTHER";

export interface SavedLocation {
  id: number;
  user_id: number;
  name: string | null;
  lat: number;
  lng: number;
  place_id: string;
  address: string;
  type: SavedLocationType;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSavedLocationParams {
  name: string | null;
  address: string;
  place_id: string;
  lat: number;
  lng: number;
  type: SavedLocationType;
  token: string;
}

export interface UpdateSavedLocationParams {
  id: number;
  name: string | null;
  address: string;
  place_id: string;
  lat: number;
  lng: number;
  type: SavedLocationType;
  token: string;
}

// Get all saved locations
export const getSavedLocations = async (token: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      "/api/web/consumer/address/saved-locations",
    {
      headers: {
        accept: "application/json",
        "accept-language": "km",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    }
  );

  const data = (await response.json()) as {
    status: boolean;
    message?: string;
    data: SavedLocation[];
  };

  return data;
};

// Create a new saved location
export const createSavedLocation = async (
  params: CreateSavedLocationParams
) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      "/api/web/consumer/address/saved-locations",
    {
      headers: {
        accept: "application/json",
        "accept-language": "km",
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: params.name,
        address: params.address,
        place_id: params.place_id,
        lat: params.lat,
        lng: params.lng,
        type: params.type,
      }),
    }
  );

  const data = (await response.json()) as {
    status: boolean;
    message?: string;
    data: SavedLocation;
  };

  return data;
};

// Update an existing saved location
export const updateSavedLocation = async (
  params: UpdateSavedLocationParams
) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/web/consumer/address/saved-locations/${params.id}`,
    {
      headers: {
        accept: "application/json",
        "accept-language": "km",
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        name: params.name,
        address: params.address,
        place_id: params.place_id,
        lat: params.lat,
        lng: params.lng,
        type: params.type,
      }),
    }
  );

  const data = (await response.json()) as {
    status: boolean;
    message?: string;
    data: SavedLocation;
  };

  return data;
};

// Delete a saved location
export const deleteSavedLocation = async (id: number, token: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/web/consumer/address/saved-locations/${id}`,
    {
      headers: {
        accept: "application/json",
        "accept-language": "km",
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    }
  );

  const data = (await response.json()) as {
    status: boolean;
    message?: string;
  };

  return data;
};
