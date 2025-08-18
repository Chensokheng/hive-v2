// types/hive-api.dto.ts

export interface HiveSearchPlaceItem {
  id: string;
  address: string;
}

export interface HiveSearchPlacesResponse {
  status: boolean;
  message: string;
  data: HiveSearchPlaceItem[];
}

export interface HiveGeocodeData {
  id: string;
  lat: number;
  lng: number;
  address: string;
}

export interface HiveGeocodeResponse {
  status: boolean;
  data: HiveGeocodeData;
}

// Extended Address interface to include Hive API data
export interface HiveAddress extends Address {
  placeId?: string; // Google Places ID from Hive API
  source: "hive" | "nominatim" | "photon" | "mapbox";
}

// Base Address interface (keeping existing structure)
export interface Address {
  id: string;
  name: string;
  nameKh?: string;
  description: string;
  fullAddress?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: "building" | "street" | "district";
  source?: string;
}
