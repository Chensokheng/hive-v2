"use server";

/* NOTE: Implementation using OSS, currently not being used */
import { unstable_cache } from "next/cache";

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

// Helper function to determine address type
const getAddressType = (
  osmType: string,
  osmClass: string
): "building" | "street" | "district" => {
  if (osmClass === "building" || osmType === "building") return "building";
  if (osmClass === "highway" || osmType === "road") return "street";
  if (osmClass === "place" || osmType === "administrative") return "district";
  return "building";
};

const getFeatureType = (
  placeTypes: string[]
): "building" | "street" | "district" => {
  if (placeTypes.includes("poi") || placeTypes.includes("address"))
    return "building";
  if (placeTypes.includes("street") || placeTypes.includes("road"))
    return "street";
  return "district";
};

// Nominatim search with caching
const searchNominatim = unstable_cache(
  async (query: string): Promise<Address[]> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&` +
          `countrycodes=kh&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=15&` +
          `accept-language=km,en&` +
          // `accept-language=en&` +
          `bounded=1&` +
          `viewbox=102.3,14.7,107.6,10.4`, // Cambodia bounding box
        {
          headers: {
            "User-Agent": "NextJS-Map-App/1.0",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Nominatim API error:",
          response.status,
          response.statusText
        );
        return [];
      }

      const data = await response.json();

      return data.map((item: any, index: number) => ({
        id: `nominatim-${Date.now()}-${index}`,
        name:
          item.display_name.split(",")[0] || item.name || "Unknown Location",
        nameKh:
          item.name && item.name !== item.display_name.split(",")[0]
            ? item.name
            : undefined,
        description:
          item.display_name.split(",").slice(1, 3).join(",").trim() ||
          item.type,
        fullAddress: item.display_name,
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        },
        type: getAddressType(item.type, item.class),
        source: "OpenStreetMap",
      }));
    } catch (error) {
      console.error("Nominatim search error:", error);
      return [];
    }
  },
  ["nominatim-search"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["geocoding", "nominatim"],
  }
);

// Photon search with caching
const searchPhoton = unstable_cache(
  async (query: string): Promise<Address[]> => {
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?` +
          `q=${encodeURIComponent(query)}&` +
          `limit=10&` +
          `bbox=102.3,10.4,107.6,14.7&` + // Cambodia bounding box
          `lang=en`,
        {
          headers: {
            "User-Agent": "NextJS-Map-App/1.0",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Photon API error:",
          response.status,
          response.statusText
        );
        return [];
      }

      const data = await response.json();

      return (
        data.features?.map((feature: any, index: number) => ({
          id: `photon-${Date.now()}-${index}`,
          name:
            feature.properties.name ||
            feature.properties.street ||
            "Unknown Location",
          nameKh: feature.properties["name:km"],
          description:
            [
              feature.properties.city,
              feature.properties.state,
              feature.properties.country,
            ]
              .filter(Boolean)
              .join(", ") || feature.properties.osm_value,
          coordinates: {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
          },
          type: getAddressType(
            feature.properties.osm_value,
            feature.properties.osm_key
          ),
          source: "Photon",
        })) || []
      );
    } catch (error) {
      console.error("Photon search error:", error);
      return [];
    }
  },
  ["photon-search"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["geocoding", "photon"],
  }
);

// MapBox search (optional, requires API key)
const searchMapbox = unstable_cache(
  async (query: string, apiKey: string): Promise<Address[]> => {
    if (!apiKey) return [];

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          `country=kh&` +
          `limit=10&` +
          // `language=km&` +
          `language=en&` +
          `access_token=${apiKey}`,
        {
          headers: {
            "User-Agent": "NextJS-Map-App/1.0",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "MapBox API error:",
          response.status,
          response.statusText
        );
        return [];
      }

      const data = await response.json();

      return (
        data.features?.map((feature: any, index: number) => ({
          id: `mapbox-${Date.now()}-${index}`,
          name: feature.text || feature.place_name.split(",")[0],
          nameKh: feature.properties["text_km"],
          description: feature.place_name.split(",").slice(1).join(",").trim(),
          coordinates: {
            lat: feature.center[1],
            lng: feature.center[0],
          },
          type: getFeatureType(feature.place_type),
          source: "MapBox",
        })) || []
      );
    } catch (error) {
      console.error("MapBox search error:", error);
      return [];
    }
  },
  ["mapbox-search"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["geocoding", "mapbox"],
  }
);

// Main search function
export async function searchAddresses(
  query: string,
  mapboxApiKey?: string
): Promise<Address[]> {
  if (!query.trim()) return [];

  try {
    // Run multiple searches in parallel for comprehensive results
    const searchPromises = [searchNominatim(query), searchPhoton(query)];

    // Add MapBox search if API key is provided
    if (mapboxApiKey) {
      searchPromises.push(searchMapbox(query, mapboxApiKey));
    }

    const results = await Promise.allSettled(searchPromises);
    const allResults: Address[] = [];

    // Combine results from all successful searches
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        allResults.push(...result.value);
      }
    });

    // Remove duplicates based on proximity (within ~100m)
    const uniqueResults: Address[] = [];
    const threshold = 0.001; // ~111m at equator

    allResults.forEach((address) => {
      const isDuplicate = uniqueResults.some(
        (existing) =>
          Math.abs(existing.coordinates.lat - address.coordinates.lat) <
            threshold &&
          Math.abs(existing.coordinates.lng - address.coordinates.lng) <
            threshold
      );

      if (!isDuplicate) {
        uniqueResults.push(address);
      }
    });

    // Sort by relevance (exact matches first, then partial matches)
    return uniqueResults
      .sort((a, b) => {
        const queryLower = query.toLowerCase();
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();

        // Exact matches first
        if (aNameLower === queryLower) return -1;
        if (bNameLower === queryLower) return 1;

        // Starts with query
        if (aNameLower.startsWith(queryLower)) return -1;
        if (bNameLower.startsWith(queryLower)) return 1;

        // Contains query
        const aContains = aNameLower.includes(queryLower);
        const bContains = bNameLower.includes(queryLower);
        if (aContains && !bContains) return -1;
        if (bContains && !aContains) return 1;

        return 0;
      })
      .slice(0, 20); // Limit to top 20 results
  } catch (error) {
    console.error("Address search error:", error);
    return [];
  }
}

// Reverse geocoding with caching
export const reverseGeocode = unstable_cache(
  async (lat: number, lng: number): Promise<string> => {
    const requestLatLng = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    console.log(">>>> reverseGeoCode: Latlng ", requestLatLng);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          `lat=${lat}&` +
          `lon=${lng}&` +
          `format=json&` +
          `addressdetails=1&` +
          // `accept-language=km,en`,
          `accept-language=en`,
        {
          headers: {
            "User-Agent": "NextJS-Map-App/1.0",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Reverse geocoding API error:",
          response.status,
          response.statusText
        );
        return requestLatLng;
      }

      const data = await response.json();
      console.log(">>>> reverseGeoCode: ", JSON.stringify(data.address));

      return data.display_name || requestLatLng;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return requestLatLng;
    }
  },
  ["reverse-geocode"],
  {
    revalidate: 86400, // Cache for 24 hours (addresses don't change often)
    tags: ["reverse-geocoding"],
  }
);

/* const reverseGeocodeWithHiveAPI = useCallback(
  async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.gohive.online/api/web/consumer/address/place-by-geocode?latlng=${lat},${lng}`,
        {
          headers: {
            "User-Agent": "NextJS-Map-App/1.0",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.status && data.data) {
        const locationData: LocationData = {
          id: data.data.id,
          lat: data.data.lat,
          lng: data.data.lng,
          address: data.data.address,
        };

        setCurrentLocation(locationData);
        return locationData;
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setError("Failed to get address for this location");

      // Fallback location data
      const fallbackLocation: LocationData = {
        id: `manual-${Date.now()}`,
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      };

      setCurrentLocation(fallbackLocation);
      return fallbackLocation;
    } finally {
      setIsReverseGeocoding(false);
    }
  },
  []
); */

// Optional: Function to clear geocoding cache
export async function clearGeocodingCache() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("geocoding");
  revalidateTag("reverse-geocoding");
}
