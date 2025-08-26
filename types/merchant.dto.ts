// Address DTO based on real API response
export interface MerchantAddressDto {
  city: string;
  ward: string;
  address: string;
  city_en: string;
  city_id: number;
  ward_en: string;
  ward_id: number;
  district: string;
  district_en: string;
  district_id: number;
}

// Merchant DTO based on real API response structure
export interface MerchantDto {
  id: number;
  name: string;
  address: MerchantAddressDto;
  distance: number;
  short_name: string;
  joinedDeliveryProgram: boolean;
  joinedTableBookingProgram: boolean;
  image: string;
  other_outlet: number;
  sub_domain: string;
}

// API Response wrapper DTO
export interface NearbyMerchantsResponseDto {
  status: boolean;
  data: {
    items: MerchantDto[];
  };
}

// Extended merchant interface that includes additional fields for UI
export interface MerchantWithUIFields extends MerchantDto {
  rating?: number;
  category?: string;
  location?: string;
  displayImage?: string; // Processed image URL
  isOpen?: boolean;
  closingTime?: string;
}

// Simplified merchant interface for UI components (backwards compatibility)
export interface TMerchantDto {
  id: number;
  image: string;
  name: string;
  rating?: number;
  category?: string;
  location: string;
}

// ============

export type CategoryResponse = {
  status: boolean;
  message: string;
  data: Category[];
};

export type Category = {
  id: number;
  name: string;
  name_en: string;
  status: number;
  image: string;
  merchant_type: string | null;
  level: number;
  priority: number;
  platform: string;
  parent_id: number | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
};
