// ==================================sign-in response========================================

export type UserResponseSuccess = {
  status: true;
  data: {
    status: true;
    data: User;
  };
};

// ❌ Error Response
export type UserResponseError = {
  status: false;
  result_code: string | null;
  error_title: string | null;
  error_message: string;
  error: string;
  data?: {
    error_message: string;
    error_title: string | null;
  };
};

// 🔀 Union type (Success | Error)
export type UserResponse = UserResponseSuccess | UserResponseError;

export type User = {
  email_confirm: number;
  allow_invite_friend: number;
  language: string;
  allow_send_sms: number;
  managed_outlet_ids: number[];
  managed_merchant_id: number | null;
  belong_merchant_id: number | null;
  user_id: string; // UUID
  national_id: string | null;
  phone: string;
  temporaryPhone: string | null;
  email: string | null;
  birthdate: string | null;
  picture: string | null;
  status: number;
  fb_id: string | null;
  gg_id: string | null;
  apple_id: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string | null;
  fullName: string;
  gender: string | null;
  created_at: number; // timestamp (ms)
  last_login: string | null;
  country_code: number;
  savyu_balance: string; // decimal as string
  identity_card_id: string | null;
  merchant_group_id: number | null;
  ringtoneNewOrder: string | null;
  ringtoneNewReservation: string | null;
  platform: number;
  is_available_for_new_orders: number;
  user_infos: UserInfo[];
  id: number;
  totalStamps: number;
  totalVouchers: number;
  _token: string; // JWT
};

export type UserInfo = {
  address: string | null;
  image_path: string | null;
  image_name: string | null;
  latitude: number | null;
  longitude: number | null;
  last_device_uuid: string | null;
  place_id: string | null;
  place_lat: number | null;
  place_long: number | null;
  place_address: string | null;
  roles: {
    id: number;
    name: string;
  };
};

// ==================================sign-in response========================================

// Profile

export interface UserProfile {
  status: boolean;
  data: {
    email_confirm: number;
    allow_invite_friend: number;
    language: string;
    allow_send_sms: number;
    managed_outlet_ids: any[]; // could refine if outlets have structure
    managed_merchant_id: string | null;
    belong_merchant_id: string | null;
    user_id: string;
    national_id: string | null;
    phone: string;
    temporaryPhone: string | null;
    email: string | null;
    birthdate: string | null;
    picture: string | null;
    status: number;
    fb_id: string | null;
    gg_id: string | null;
    apple_id: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string | null;
    fullName: string;
    gender: string | null;
    created_at: number;
    last_login: string | null;
    country_code: number;
    savyu_balance: string;
    identity_card_id: string | null;
    merchant_group_id: string | null;
    ringtoneNewOrder: string | null;
    ringtoneNewReservation: string | null;
    platform: number;
    is_available_for_new_orders: number;
    user_infos: {
      address: string | null;
      image_path: string | null;
      image_name: string | null;
      latitude: number | null;
      longitude: number | null;
      last_device_uuid: string | null;
      place_id: string;
      place_lat: number;
      place_long: number;
      place_address: string;
      roles: {
        id: number;
        name: string;
      };
    }[];
    referral_code: string;
    totalStamps: number;
    totalVouchers: number;
    id: number;
    referal_code: string; // typo duplicate but included
  };
}

// End Profile

// get merchants listing

export interface MerchantsListingResponse {
  status: boolean;
  data: {
    collections: {
      id: number;
      name: string;
      order: number;
      status: number;
      name_en: string;
      name_fr: string;
      name_ja: string;
      name_ko: string;
      name_ru: string;
      name_zh: string;
      merchants: {
        id: number;
        name: string;
        tags: { id: number; name: string }[] | null;
        image: string;
        address: {
          city: string;
          ward: string;
          address: string;
          district: string;
          address_detail: string | null;
          city_en: string | null;
          city_id: number | null;
          ward_en: string | null;
          ward_id: number | null;
          district_en: string | null;
          district_id: number | null;
        };
        outlets: {
          id: number;
          name: string;
          address: {
            city: string;
            ward: string;
            address: string;
            city_en: string | null;
            city_id: number | null;
            ward_en: string | null;
            ward_id: number | null;
            district: string;
            district_en: string | null;
            district_id: number | null;
          };
          short_name: string;
          joinedDeliveryProgram: boolean;
          joinedContactlessProgram: boolean | null;
          joinedTableBookingProgram: boolean;
        }[];
        categories: { id: number; name: string }[] | null;
        sub_domain: string;
        joinedDelivery: boolean;
        merchant_marketing_id: number | null;
        hierarchical_categories: { id: number; name: string }[] | null;
        joinedContactlessProgram: boolean;
        joinedTableBookingProgram: boolean;
        kolHasJoinedMerchantMarketing: boolean | null;
        merchant_marketing: {
          id: number;
          commission_percent: number;
          status: string;
        } | null;
        kol_merchant_marketing_request: any | null;
      }[];
      color: string | null;
    }[];
    merchants: {
      results: {
        id: number;
        name: string;
        sub_domain: string;
        categories: { id: number; name: string }[] | null;
        hierarchical_categories: { id: number; name: string }[] | null;
        tags: { id: number; name: string }[] | null;
        address: {
          city: string;
          ward: string;
          address: string;
          district: string;
          address_detail: string | null;
          city_en: string | null;
          city_id: number | null;
          ward_en: string | null;
          ward_id: number | null;
          district_en: string | null;
          district_id: number | null;
        };
        image: string;
        outlets: {
          id: number;
          name: string;
          address: {
            city: string;
            ward: string;
            address: string;
            city_en: string | null;
            city_id: number | null;
            ward_en: string | null;
            ward_id: number | null;
            district: string;
            district_en: string | null;
            district_id: number | null;
          };
          short_name: string;
          joinedDeliveryProgram: boolean;
          joinedContactlessProgram: boolean | null;
          joinedTableBookingProgram: boolean;
        }[];
        joinedDelivery: boolean;
        joinedTableBooking: boolean | null;
        merchant_marketing_id: number | null;
        kolHasJoinedMerchantMarketing: boolean | null;
        merchant_marketing: {
          id: number;
          commission_percent: number;
          status: string;
        } | null;
        kol_merchant_marketing_request: any | null;
      }[];
      pagination: {
        limit: number;
        load_more: boolean;
      };
    };
  };
}

// end get merchant listing
