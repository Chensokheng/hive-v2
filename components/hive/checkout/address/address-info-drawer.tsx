"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { reverseGeocode, searchAddresses } from "@/services/map/get-map";
import type { Address } from "@/services/map/get-map";
import { useAddresStore } from "@/store/address";
import {
  BriefcaseBusiness,
  ChevronLeft,
  Home,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CurrentLocationIcon from "@/components/icon/current-location";
import MapPin from "@/components/icon/map-pin";

import { AddressModal, type TAddressType } from "./address-form-modal";

interface AddressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlaceDetailResponse {
  status: boolean;
  message: string;
  data: {
    user_id: number;
    place_id: string;
    lat: number;
    lng: number;
    long: number;
    address: string;
  };
}

const DEFAULT_LAT_LNG = { lat: 11.550966450309836, lng: 104.9287729533798 }; // Keystone building

const MapViewOnlyInner = dynamic(
  () => import("@/components/map-v2/MapViewOnlyComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    ),
  }
);

export function AddressInfoDrawer({ isOpen, onClose }: AddressDrawerProps) {
  // Separate search query from selected location
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const setSavedAddressModal = useAddresStore(
    (state) => state.setSavedAddressModal
  );

  // This state controls the map - only updates when user makes a selection
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Keystone Building",
    address: "Phnom Penh",
    coordinates: DEFAULT_LAT_LNG,
  });

  // Track if we're fetching place details (separate from search loading)
  const [isFetchingPlaceDetails, setIsFetchingPlaceDetails] = useState(false);

  const [addressType, setAddressType] = useState<TAddressType>("other");
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Search function - ONLY updates search results, NOT the map
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchAddresses(query, undefined); // Prioritize Hive API
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect - ONLY for search results
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Handle location selection from search results - ONLY this updates the map
  const handleLocationSelect = async (address: Address) => {
    // Immediately close search results and update search query
    setShowResults(false);
    setSearchQuery(address.name);

    setSelectedLocation({
      name: address.name,
      address: address.fullAddress || address.description,
      coordinates: {
        lat: address.coordinates.lat,
        lng: address.coordinates.lng,
      },
    });
  };

  // Handle current location - this also updates the map
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingPlaceDetails(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const address = await reverseGeocode(coords.lat, coords.lng);

          try {
            // Force map re-render by creating new object
            setSelectedLocation({
              name: address.split(",")[0], // FIXME: useTranslation
              address: address,
              coordinates: {
                lat: coords.lat,
                lng: coords.lng,
              },
            });
            setSearchQuery("Current Location");
            setShowResults(false); // Ensure dropdown is closed
          } finally {
            setShowResults(false); // Ensure dropdown is closed
            setIsFetchingPlaceDetails(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your current location. Please ensure location services are enabled."
          );
          setIsFetchingPlaceDetails(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const showAddressPopup = (type: TAddressType) => {
    setAddressType(type);
    setShowAddressModal(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Handle clicking outside to close dropdown
  const handleSearchResultClick = (result: Address) => {
    // Prevent the blur event from interfering
    handleLocationSelect(result);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md lg:max-w-lg p-0"
          showCloseBtn={false}
        >
          <SheetHeader className="hidden">
            <SheetTitle className="hidden" aria-readonly>
              Address Details
            </SheetTitle>
            <SheetDescription className="hidden" aria-readonly>
              Choose or add a delivery address
            </SheetDescription>
          </SheetHeader>

          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <button onClick={onClose} className="h-9 w-9">
              <ChevronLeft className="h-7 w-7 text-primary" />
            </button>
            <h2 className="text-lg font-bold">Address Details</h2>
            <div className="w-8" /> {/* Spacer */}
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Choose Address Section */}
            <div className="p-4">
              <h3 className="text-base font-bold mb-3">Choose Address</h3>

              {/* Search Input */}
              <div className="relative mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for delivery address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Only updates search, not map
                    onFocus={() => {
                      if (searchResults.length > 0) {
                        setShowResults(true);
                      }
                    }}
                    className="pl-10 pr-10 py-2 rounded-full bg-secondary border-gray-200 focus:border-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-60 max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onMouseDown={() => handleSearchResultClick(result)} // Use onMouseDown instead of onClick
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">
                              {result.name}
                              {result.nameKh && (
                                <span className="text-sm text-gray-600 ml-2">
                                  ({result.nameKh})
                                </span>
                              )}
                              {result.source && (
                                <span className="text-xs text-blue-500 ml-2 px-1 py-0.5 bg-blue-50 rounded">
                                  {result.source}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {result.fullAddress || result.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-1 border-secondary rounded-lg">
                {/* Map view-only */}
                <div className="h-30 bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer">
                  {isFetchingPlaceDetails ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Loading location details...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <MapViewOnlyInner
                      key={`${selectedLocation.coordinates.lat}-${selectedLocation.coordinates.lng}`}
                      center={selectedLocation.coordinates}
                    />
                  )}
                </div>

                {/* Selected Location Description */}
                <div className="bottom-0 left-0 right-0 bg-white shadow-md rounded-b-lg overflow-hidden cursor-pointer">
                  <div className="flex items-center gap-x-2 p-2">
                    <MapPin className="text-gray-500 h-6 w-6 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold truncate">
                        {selectedLocation.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {selectedLocation.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Use Current Location */}
              <button
                onClick={handleUseCurrentLocation}
                disabled={isFetchingPlaceDetails}
                className="flex items-center gap-3 p-3 w-full hover:bg-primary/10 rounded-lg transition-colors group cursor-pointer disabled:opacity-50"
              >
                <CurrentLocationIcon className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">
                  {isFetchingPlaceDetails
                    ? "Getting location..."
                    : "Use Current Location"}
                </span>
              </button>
            </div>

            {/* Saved Address Section */}
            <div className="px-4 pb-6">
              <h3 className="text-base font-semibold mb-4">Saved Address</h3>

              <div className="space-y-3">
                {/* Add Home Address */}
                <button
                  onClick={() => showAddressPopup("home")}
                  className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-primary" strokeWidth={2.5} />
                    <span className="text-primary font-medium">
                      Add Home Address
                    </span>
                  </div>
                  <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
                </button>
                <Separator className="mb-0" />

                {/* Add Work Address */}
                <button
                  onClick={() => showAddressPopup("work")}
                  className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BriefcaseBusiness
                      className="h-4 w-4 text-primary"
                      strokeWidth={2.5}
                    />
                    <span className="text-primary font-medium">
                      Add Work Address
                    </span>
                  </div>
                  <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
                </button>
                <Separator className="mb-0" />

                {/* Add Other Address */}
                <button
                  onClick={() => showAddressPopup("other")}
                  className="flex items-center gap-3 w-full mb-0 p-4 hover:bg-primary/10 transition-colors text-left cursor-pointer"
                >
                  <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
                  <span className="text-primary font-semibold">
                    Add Other Address
                  </span>
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {showAddressModal && (
        <AddressModal
          addressType={addressType}
          setOpenModal={setSavedAddressModal}
        />
      )}
    </>
  );
}
