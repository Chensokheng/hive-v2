'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown, ChevronLeft, Plus, MapPin, Home, Building, Loader2, Target, Navigation } from 'lucide-react';
import { searchAddresses, reverseGeocode, type Address } from '@/services/map/get-map';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  ),
});

const CAMBODIA_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Central Market (Phsar Thmei)',
    nameKh: 'ផ្សារថ្មី',
    description: 'Phnom Penh',
    coordinates: { lat: 11.5696, lng: 104.9252 },
    type: 'building'
  },
  {
    id: '2',
    name: 'Royal Palace',
    nameKh: 'ព្រះបរមរាជវាំង',
    description: 'Phnom Penh',
    coordinates: { lat: 11.5564, lng: 104.9282 },
    type: 'building'
  },
  {
    id: '3',
    name: 'Keystone Building',
    nameKh: 'អគារគីស្តូន',
    description: 'Phnom Penh',
    coordinates: { lat: 11.5449, lng: 104.8922 },
    type: 'building'
  },
  {
    id: '4',
    name: 'Diamond Island',
    nameKh: 'កោះពេជ្រ',
    description: 'Phnom Penh',
    coordinates: { lat: 11.5449, lng: 104.9047 },
    type: 'building'
  },
  {
    id: '5',
    name: 'Aeon Mall Sen Sok',
    nameKh: 'អឺអុនម៉ាល់សែនសុខ',
    description: 'Sen Sok, Phnom Penh',
    coordinates: { lat: 11.5951, lng: 104.8984 },
    type: 'building'
  },
  {
    id: '6',
    name: 'Independence Monument',
    nameKh: 'វិមានឯករាជ្យ',
    description: 'Phnom Penh',
    coordinates: { lat: 11.5569, lng: 104.9280 },
    type: 'building'
  },
  {
    id: '7',
    name: 'Wat Phnom',
    nameKh: 'វត្តភ្នំ',
    description: 'Phnom Penh',
    coordinates: { lat: 11.5794, lng: 104.9211 },
    type: 'building'
  }
];

export default function AddressPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [filteredAddresses, setFilteredAddresses] = useState<Address[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 11.5564, lng: 104.9282 });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropPin, setShowDropPin] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [currentPinLocation, setCurrentPinLocation] = useState<{lat: number, lng: number} | null>(null);

  // Enhanced search function using server actions
  const filterAddresses = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredAddresses([]);
      return;
    }

    setIsSearching(true);

    try {
      // First search local predefined addresses for instant results
      const localFiltered = CAMBODIA_ADDRESSES.filter(address =>
        address.name.toLowerCase().includes(query.toLowerCase()) ||
        address.nameKh?.includes(query) ||
        address.description.toLowerCase().includes(query.toLowerCase())
      );

      // Show local results immediately
      if (localFiltered.length > 0) {
        setFilteredAddresses(localFiltered);
      }

      // Use server action for global search
      const globalResults = await searchAddresses(query, process.env.NEXT_PUBLIC_MAPBOX_API_KEY);
      
      // Combine local and global, prioritizing local matches
      const combinedResults = [
        ...localFiltered,
        ...globalResults.filter(global => 
          !localFiltered.some(local => 
            Math.abs(local.coordinates.lat - global.coordinates.lat) < 0.001 &&
            Math.abs(local.coordinates.lng - global.coordinates.lng) < 0.001
          )
        )
      ];

      setFilteredAddresses(combinedResults.slice(0, 15)); // Show top 15 results
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local results only
      const localFiltered = CAMBODIA_ADDRESSES.filter(address =>
        address.name.toLowerCase().includes(query.toLowerCase()) ||
        address.nameKh?.includes(query) ||
        address.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAddresses(localFiltered);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced reverse geocoding using server action
  const debouncedReverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const address = await reverseGeocode(lat, lng);
      if (showDropPin) {
        setCurrentPinLocation({ lat, lng });
        // Update search query to show current pin location info
        setSearchQuery(`📍 ${address}`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    } finally {
      setIsReverseGeocoding(false);
    }
  }, [showDropPin]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterAddresses(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterAddresses]);

  // Location helper function using server action
  async function takeV1_1Location(takeLatLng: {lat: number, lng: number}) {
    console.log("takev1_1: ", takeLatLng);
    const coords = takeLatLng;
    
    setMapCenter(coords);
    const currentAddr = await reverseGeocode(coords.lat, coords.lng);
    
    setSelectedAddress({
      id: 'current',
      name: 'Current Location',
      nameKh: 'ទីតាំងបច្ចុប្បន្ន',
      description: currentAddr,
      coordinates: coords,
      type: 'building'
    });
    setSearchQuery(currentAddr);
    setShowDropPin(false);
    setIsLocating(false);
  }

  // Debounced effect for reverse geocoding when map moves in drop pin mode
  useEffect(() => {
    takeV1_1Location(mapCenter);
    if (!showDropPin || selectedAddress) return;
    
    const timeoutId = setTimeout(() => {
      debouncedReverseGeocode(mapCenter.lat, mapCenter.lng);
    }, 1000); // 1 second delay

    return () => clearTimeout(timeoutId);
  }, [mapCenter, showDropPin, debouncedReverseGeocode]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setSearchQuery(address.nameKh ? `${address.name} (${address.nameKh})` : address.name);
    setShowDropdown(false);
    setShowDropPin(false);
    setMapCenter(address.coordinates);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(true);
    
    if (!value.trim()) {
      setSelectedAddress(null);
    }
  };

  const useCurrentLocation = async () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          takeV1_1Location(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          alert('Unable to get your current location. Please ensure location services are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleDropPin = async () => {
    setShowDropPin(true);
    setSelectedAddress(null);
    setShowDropdown(false);
    setCurrentPinLocation(mapCenter);
    
    // Use server action for initial reverse geocoding
    takeV1_1Location(mapCenter);
    
    setIsReverseGeocoding(true);
    try {
      const address = await reverseGeocode(mapCenter.lat, mapCenter.lng);
      setSearchQuery(`📍 ${address}`);
      setMapCenter(mapCenter);
    } catch (error) {
      setSearchQuery('📍 Drop Pin Mode');
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const addSavedAddress = (type: 'home' | 'work' | 'other') => {
    // This would typically open a modal or navigate to an add address form
    console.log(`Add ${type} address`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-4">
          <button className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Address Details</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Map */}
        <div className="relative">
          <MapComponent 
            center={mapCenter}
            selectedAddress={selectedAddress}
            zoom={16}
            showDropPin={showDropPin}
            onMapMove={(lat, lng) => {
              takeV1_1Location({lat, lng});
              if (showDropPin) {
                // setMapCenter({ lat, lng });
              }
            }}
            onMapClick={(lat, lng) => {
              // if (showDropPin) {
              //   setMapCenter({ lat, lng });
              // }
            }}
          />
          
          {/* Drop Pin Info Panel */}
          {showDropPin && (
            <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 z-50">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {isReverseGeocoding ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-500">Getting location info...</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 truncate">
                      {currentPinLocation ? 
                        `📍 ${currentPinLocation.lat.toFixed(4)}, ${currentPinLocation.lng.toFixed(4)}` :
                        'Drag map to position pin' 
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Drop Pin Action Button */}
          {showDropPin && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
              <div className="flex space-x-2">
                <button
                  onClick={async () => {
                    if (currentPinLocation) {
                      const address = await reverseGeocode(currentPinLocation.lat, currentPinLocation.lng);
                      const droppedAddress: Address = {
                        id: 'dropped-pin',
                        name: 'Dropped Pin Location',
                        nameKh: 'ទីតាំងដាក់ម្ជុល',
                        description: address,
                        coordinates: currentPinLocation,
                        type: 'building'
                      };
                      
                      setSelectedAddress(droppedAddress);
                      setSearchQuery('Dropped Pin Location');
                      setShowDropPin(false);
                      setCurrentPinLocation(null);
                    }
                  }}
                  disabled={!currentPinLocation}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium shadow-lg flex items-center space-x-2"
                >
                  <Target className="w-4 h-4" />
                  <span>Confirm Pin</span>
                </button>
                <button
                  onClick={() => {
                    setShowDropPin(false);
                    setCurrentPinLocation(null);
                    setSearchQuery('');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Choose Address Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Address</h2>
          
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="text"
                placeholder="Enter delivery address (English or ខ្មែរ)"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-12 pr-12 py-4 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isSearching || isReverseGeocoding ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Search Dropdown */}
            {showDropdown && (filteredAddresses.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-80 overflow-y-auto">
                {isSearching && filteredAddresses.length === 0 ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : (
                  filteredAddresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => handleAddressSelect(address)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">
                            {address.name}
                            {address.nameKh && (
                              <span className="text-sm text-gray-600 ml-2">({address.nameKh})</span>
                            )}
                            {address.source && (
                              <span className="text-xs text-blue-500 ml-2 px-1 py-0.5 bg-blue-50 rounded">
                                {address.source}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {address.fullAddress || address.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Location Options */}
        <div className="space-y-3">
          {/* Use Current Location */}
          <button
            onClick={useCurrentLocation}
            disabled={isLocating}
            className="flex items-center space-x-3 w-full text-left py-2 disabled:opacity-50"
          >
            <div className="w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center">
              {isLocating ? (
                <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
              ) : (
                <Navigation className="w-3 h-3 text-blue-600" />
              )}
            </div>
            <span className="text-blue-600 font-medium">
              {isLocating ? 'Getting your location...' : 'Use Current Location'}
            </span>
          </button>

          {/* Drop Pin */}
          <button
            onClick={handleDropPin}
            className="flex items-center space-x-3 w-full text-left py-2"
          >
            <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
              <Target className="w-3 h-3 text-orange-500" />
            </div>
            <span className="text-orange-500 font-medium">Drop Pin on Map</span>
          </button>
        </div>

        {/* Saved Address Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Address</h2>
          
          <div className="space-y-1">
            {/* Add Home Address */}
            <button
              onClick={() => addSavedAddress('home')}
              className="flex items-center justify-between w-full py-4 text-left"
            >
              <div className="flex items-center space-x-3">
                <Home className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600 font-medium">Add Home Address</span>
              </div>
              <Plus className="w-6 h-6 text-blue-600" />
            </button>

            {/* Add Work Address */}
            <button
              onClick={() => addSavedAddress('work')}
              className="flex items-center justify-between w-full py-4 text-left"
            >
              <div className="flex items-center space-x-3">
                <Building className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600 font-medium">Add Work Address</span>
              </div>
              <Plus className="w-6 h-6 text-blue-600" />
            </button>

            {/* Add Other Address */}
            <button
              onClick={() => addSavedAddress('other')}
              className="flex items-center justify-between w-full py-4 text-left"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600 font-medium">Add Other Address</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
