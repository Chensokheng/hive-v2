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
