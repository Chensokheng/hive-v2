import {
  MerchantAddressDto,
  MerchantDto,
  NearbyMerchantsResponseDto,
  TMerchantDto,
} from "@/types";

// Helper function to format address from complex structure to simple location string
const formatAddressToLocation = (address: MerchantAddressDto): string => {
  const parts = [];
  if (address.address) parts.push(address.address);
  if (address.district_en || address.district)
    parts.push(address.district_en || address.district);
  if (address.city_en || address.city)
    parts.push(address.city_en || address.city);
  return parts.join(", ");
};

// Helper function to process image URL (you can modify this based on your image handling logic)
const processImageUrl = (imageFileName: string): string => {
  // If it's already a full URL or path, return as is
  if (imageFileName.startsWith("http") || imageFileName.startsWith("/")) {
    return imageFileName;
  }
  // Otherwise, construct the full URL (modify this based on your actual image URL structure)
  return `/api/images/${imageFileName}`; // or your actual image base URL
};

// Transformation function from API response to UI format
export const transformMerchantToSimple = (
  merchant: MerchantDto
): TMerchantDto => {
  return {
    id: merchant.id,
    name: merchant.name,
    image: processImageUrl(merchant.image),
    location: formatAddressToLocation(merchant.address),
  };
};

// Transform array of merchants
export const transformMerchantsToSimple = (
  merchants: MerchantDto[]
): TMerchantDto[] => {
  return merchants.map(transformMerchantToSimple);
};

// Function that returns fake data in the format expected by UI components
export const getNearByMerchants = async (): Promise<TMerchantDto[]> => {
  // Option 1: Use fake data for development
  // return nearbyRestaurants

  // Option 2: Use real API and transform the response
  const apiResponse = await getNearByMerchantsApi();
  return transformMerchantsToSimple(apiResponse.data.items);
};

// Function that mimics the real API response structure
export const getNearByMerchantsApi =
  async (): Promise<NearbyMerchantsResponseDto> => {
    // This would be replaced with actual API call
    // For now, return fake data in the real API format
    return {
      status: true,
      data: {
        items: [
          {
            id: 61,
            name: "The Brew Coffee & Beverage",
            address: {
              city: "ភ្នំពេញ",
              ward: "",
              address: "Keystone Building",
              city_en: "Phnom Penh",
              city_id: 1,
              ward_en: "",
              ward_id: 1,
              district: "ចំការមន",
              district_en: "Chamkarmon",
              district_id: 2,
            },
            distance: 0,
            short_name: "The-Brew-Cafe",
            joinedDeliveryProgram: true,
            joinedTableBookingProgram: false,
            image: "643080fd-b463-47cb-83b4-0ab607fb7b11.jpg",
            other_outlet: 0,
            sub_domain: "Thebrewcafe",
          },
        ],
      },
    };
  };
