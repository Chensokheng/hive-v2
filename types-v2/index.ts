// ==================================sign-in response========================================

export type UserResponseSuccess = {
  status: true;
  data: User;
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
  hasPassword: boolean;
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
    hasPassword: boolean;
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

// ========/merchants/sub-domain/=======

export interface MerchantInfoResponse {
  status: boolean;
  data: {
    type: string; // e.g. "merchant"
    data: {
      name: string;
      outlets: {
        id: number;
        name: string;
        short_name: string;
        address: string;
        address_en: string;
        image: string;
        joinedDeliveryProgram: boolean;
        joinedContactlessProgram: boolean;
        enableTableBooking: boolean;
        distance: number;
      }[];
      isExistKolOffer: boolean;
      enableMarketingProgram: boolean;
      numberOfDeals: number;
      numberOfStampDeals: number;
      bannerDeal: string | null;
    };
  };
}
// ========/merchants/sub-domain/=======

// api/web/menu/categories?outlet_id
export interface OutletCategoryResponse {
  status: boolean;
  data: {
    id: number;
    name: string;
    name_vi: string;
    name_th: string;
  }[];
}
//api/web/menu/categories?outlet_id

//
export interface OutletMenuResponse {
  status: boolean;
  data: {
    items: {
      id: number;
      name: string;
      name_vi: string;
      name_th: string;
      menu_items: {
        id: number;
        name: string;
        name_vi: string;
        name_th: string;
        description_vi: string;
        description_th: string;
        thumbnail_image_name: string;
        base_price: number;
        promotion_price: number;
        status: number;
        adults_only: number;
        time_out_of_stock: string | null;
        itemCd: string;
        hasAddon: boolean;
        brand: string | null;
      }[];
    }[];
    pagination: {
      limit: number;
      load_more: boolean;
    };
  };
}
//

// get outlet unpaid item

export type UnpaidOutletItems = {
  status: boolean;
  message: string;
  data: {
    qty: number;
    subtotal: number;
    discount: number;
    distance: number;
    shipping_fee: number;
    shipping_tip: number;
    other_fee: number;
    status: string;
    is_web: number;
    type: string;
    promotedItems: any[];
    happyHoursProductItemIds: any[];
    discountDetails: any[];
    id: number;
    user_id: number;
    outlet_id: number;
    payment: Record<string, any>;
    reward: any;
    meta: {
      order_type: string;
      quotations: {
        details: {
          distance: number;
          totalFee: number;
        }[];
        distance: number;
        duration: number;
        totalFee: number;
      };
      estimated_arrival: number;
    };
    receiver: Record<string, any>;
    applicable_fees: {
      title: string;
      value: number;
      order: number;
    }[];
    note: string | null;
    contactless_notes: string | null;
    user_tmp_uuid: string | null;
    offer_id: string | null;
    created_at: string;
    updated_at: string;
    routeCoordinates: {
      toLatitude: number;
      toLongitude: number;
      fromLatitude: number;
      fromLongitude: number;
    };
    items: {
      id: number;
      cart_id: number;
      menu_item_id: number;
      qty: number;
      note: string;
      created_at: string;
      updated_at: string;
      isCompensationProduct: number;
      promotionQty: number;
      menuItem: {
        id: number;
        outlet_id: number;
        category_id: number;
        name: string;
        name_en: string;
        name_zh: string;
        name_ko: string;
        name_fr: string;
        name_ru: string;
        name_ja: string;
        name_vi: string;
        name_th: string;
        description: string;
        description_en: string;
        description_zh: string;
        description_ko: string;
        description_fr: string;
        description_ru: string;
        description_ja: string;
        description_vi: string;
        description_th: string;
        notes: string | null;
        image_name: string;
        thumbnail_image_name: string;
        base_price: number;
        promotion_price: number;
        discount_amount: number;
        discount_percent: number | null;
        order: number;
        status: number;
        adults_only: number;
        recommended: boolean;
        type: string;
        vat: number;
        tax_id: number;
        time_out_of_stock: string | null;
        created_at: string;
        updated_at: string;
        itemCd: string;
        master_menu_id: number;
        menuCategory: {
          id: number;
          status: number;
          order: number;
          name: string;
          name_en: string;
          name_zh: string;
          name_ko: string;
          name_fr: string;
          name_ru: string;
          name_ja: string;
          name_vi: string;
          name_th: string;
          merchant_id: number;
          created_at: string;
          updated_at: string;
          use_showing_hours: number;
          showing_hours: string | null;
          available_time_id: number | null;
          available_times: any;
        };
        icons: any[];
      };
      cart_addon_items: any[];
      cart_discounted_product: any;
      cart_custom_discounted_product: any;
      promotionCartItem: any;
      base_price: number;
      promotion_price: number;
      formated_addon_items: string;
      is_happy_hour_product: boolean;
    }[];
    user: {
      email_confirm: number;
      allow_invite_friend: number;
      language: string;
      allow_send_sms: number;
      managed_outlet_ids: any[];
      managed_merchant_id: number | null;
      belong_merchant_id: number | null;
      id: number;
      user_id: {
        type: string;
        data: number[];
      };
      national_id: string | null;
      phone: string;
      temporaryPhone: string | null;
      email: string | null;
      birthdate: string | null;
      password: string | null;
      pin: string;
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
      created_at: string;
      updated_at: string;
      last_login: string | null;
      deleted_at: string | null;
      country_code: number;
      savyu_balance: string;
      identity_card_id: string | null;
      merchant_group_id: string | null;
      ringtoneNewOrder: string | null;
      ringtoneNewReservation: string | null;
      platform: number;
      is_auto: number | null;
      is_available_for_new_orders: number;
      full_name: string;
    };
    outlet: {
      approved: number;
      id: number;
      merchant_id: number;
      status: number;
      name: string;
      address: {
        city: string;
        ward: string;
        district: string;
        address_detail: string;
      };
      latitude: string;
      longitude: string;
      open_hour: string;
      close_hour: string;
      use_working_hours: number;
      working_hours: string | null;
      contactless_temporarily_closed: number;
      contactless_closed_from: string | null;
      contactless_closed_to: string | null;
      contactless_last_order_time: string | null;
      temporarily_closed_from: string | null;
      temporarily_closed_to: string | null;
      tolerance_radius: number;
      tolerance_time: number;
      onboard_at: string | null;
      deactive_at: string | null;
      terminated_at: string | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      is_franchise: number;
      mca: string;
      phone: string;
      delivery_note: string;
      parking_fee: string | null;
      city_key: string;
      province_id: number;
      district_id: number;
      ward_id: number;
      address_detail: string;
      short_name: string;
      available_time_id: number | null;
      storeCd: string | null;
      province_detail: {
        id: number;
        name: string;
        name_en: string;
      };
      district_detail: {
        id: number;
        name: string;
        name_en: string;
        province_id: number;
      };
      ward_detail: {
        id: number;
        name: string;
        name_en: string;
        district_id: number | null;
      };
      available_times: any;
      merchant: {
        approved: number;
        allow_invite_friend: number;
        language: string;
        id: number;
        status: number;
        name: string;
        short_name: string;
        email: string;
        mca: string;
        address: {
          city: string;
          ward: string;
          address: string;
          district: string;
          address_detail: string;
        };
        phone: string;
        logo_path: string;
        logo_image: string;
        fanpage: string;
        website: string;
        introduction: string;
        tax_code: string;
        company_name: string;
        company_address: string;
        beneficiary: string;
        bank_account: string;
        bank_name: string;
        bank_branch: string;
        onboard_at: string | null;
        deactive_at: string | null;
        terminated_at: string | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        zalo_notification: boolean;
        pay_by_cash_fee_percentage: number | null;
        redeem_svd_fee_percentage: number | null;
        redeem_voucher_fee_percentage: number | null;
        transaction_reward_percentage: number | null;
        max_transaction_reward_value: number | null;
        menus: any[];
        hidden: boolean;
        merchant_group_id: number | null;
        apply_contactless_pay_by_cash: number;
        merchant_type: string;
        enable_custom_menu_show_time: number;
        allow_contactless_guest_user: number;
        recent_origin_language: string | null;
        preferred_language: string | null;
        translated_characters: number;
        sub_domain: string;
        show_take_away_orders_page: number;
        enable_order_distribution: number;
        approved_menu: number;
        package_code: string | null;
        sale_code: string | null;
        province_id: number;
        district_id: number;
        ward_id: number | null;
        address_detail: string;
        sentEmailsMonthlyCount: number;
        businessType: string;
        merchantOwnerName: string;
        categories: {
          id: number;
          name: string;
          status: number;
          image_path: string | null;
          image_name: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          position: number;
        }[];
      };
    };
    offer: any;
    total_custom_vat: number;
    final_total: number;
  };
};

// get outlet unpaid item

// add to cart response
export type AddtoCartResponse = {
  status: boolean;
  message: string;
  data: {
    qty: number;
    subtotal: number;
    discount: number;
    distance: number;
    shipping_fee: number;
    shipping_tip: number;
    other_fee: number;
    status: string;
    is_web: number;
    type: string;
    promotedItems: any[];
    happyHoursProductItemIds: any[];
    discountDetails: any[];
    user_id: number;
    user: {
      email_confirm: number;
      allow_invite_friend: number;
      language: string;
      allow_send_sms: number;
      managed_outlet_ids: any[];
      managed_merchant_id: number | null;
      belong_merchant_id: number | null;
      id: number;
      user_id: {
        type: string;
        data: number[];
      };
      national_id: string | null;
      phone: string;
      temporaryPhone: string | null;
      email: string | null;
      birthdate: string | null;
      password: string | null;
      pin: string;
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
      created_at: string;
      updated_at: string;
      last_login: string | null;
      deleted_at: string | null;
      country_code: number;
      savyu_balance: string;
      identity_card_id: string | null;
      merchant_group_id: string | null;
      ringtoneNewOrder: string | null;
      ringtoneNewReservation: string | null;
      platform: number;
      is_auto: string | null;
      is_available_for_new_orders: number;
      referral_code: {
        code: string;
        id: number;
        used_count: number;
        user_id: number;
        merchant_id: number | null;
      };
      full_name: string;
    };
    outlet_id: number;
    outlet: {
      approved: number;
      id: number;
      merchant_id: number;
      status: number;
      name: string;
      address: {
        city: string;
        ward: string;
        district: string;
        address_detail: string;
      };
      latitude: string;
      longitude: string;
      open_hour: string;
      close_hour: string;
      use_working_hours: number;
      working_hours: string | null;
      contactless_temporarily_closed: number;
      contactless_closed_from: string | null;
      contactless_closed_to: string | null;
      contactless_last_order_time: string | null;
      temporarily_closed_from: string | null;
      temporarily_closed_to: string | null;
      tolerance_radius: number;
      tolerance_time: number;
      onboard_at: string | null;
      deactive_at: string | null;
      terminated_at: string | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      is_franchise: number;
      mca: string;
      phone: string;
      delivery_note: string;
      parking_fee: string | null;
      city_key: string;
      province_id: number;
      district_id: number;
      ward_id: number;
      address_detail: string;
      short_name: string;
      available_time_id: number;
      storeCd: string | null;
      province_detail: {
        id: number;
        name: string;
        name_en: string;
      };
      district_detail: {
        id: number;
        name: string;
        name_en: string;
        province_id: number;
      };
      ward_detail: {
        id: number;
        name: string;
        name_en: string;
        district_id: number | null;
      };
      available_times: {
        id: number;
        merchant_id: number;
        name: string;
        week: {
          day: string[];
          time: {
            to: string;
            from: string;
          }[];
        }[];
        created_at: string;
        updated_at: string;
        deletedAt: string | null;
        type: string;
      };
      merchant: {
        approved: number;
        allow_invite_friend: number;
        language: string;
        id: number;
        status: number;
        name: string;
        short_name: string;
        email: string;
        mca: string;
        address: {
          city: string;
          ward: string;
          address: string;
          district: string;
          address_detail: string;
        };
        phone: string;
        logo_path: string;
        logo_image: string;
        fanpage: string;
        website: string;
        introduction: string;
        tax_code: string;
        company_name: string;
        company_address: string;
        beneficiary: string;
        bank_account: string;
        bank_name: string;
        bank_branch: string;
        onboard_at: string | null;
        deactive_at: string | null;
        terminated_at: string | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        zalo_notification: boolean;
        pay_by_cash_fee_percentage: string | null;
        redeem_svd_fee_percentage: string | null;
        redeem_voucher_fee_percentage: string | null;
        transaction_reward_percentage: string | null;
        max_transaction_reward_value: string | null;
        menus: any[];
        hidden: boolean;
        merchant_group_id: string | null;
        apply_contactless_pay_by_cash: number;
        merchant_type: string;
        enable_custom_menu_show_time: number;
        allow_contactless_guest_user: number;
        recent_origin_language: string | null;
        preferred_language: string | null;
        translated_characters: number;
        sub_domain: string;
        show_take_away_orders_page: number;
        enable_order_distribution: number;
        approved_menu: number;
        package_code: string | null;
        sale_code: string | null;
        province_id: number;
        district_id: number;
        ward_id: number | null;
        address_detail: string;
        sentEmailsMonthlyCount: number;
        businessType: string;
        merchantOwnerName: string;
      };
    };
    offer_id: string | null;
    payment: string | null;
    reward: string | null;
    meta: string | null;
    receiver: string | null;
    applicable_fees: {
      title: string;
      value: number;
      order: number;
    }[];
    routeCoordinates: string | null;
    id: number;
    created_at: string;
    updated_at: string;
    items: {
      menuItem: {
        id: number;
        outlet_id: number;
        category_id: number;
        name: string;
        name_en: string;
        name_zh: string;
        name_ko: string;
        name_fr: string;
        name_ru: string;
        name_ja: string;
        name_vi: string;
        name_th: string;
        description: string;
        description_en: string;
        description_zh: string;
        description_ko: string;
        description_fr: string;
        description_ru: string;
        description_ja: string;
        description_vi: string;
        description_th: string;
        notes: string | null;
        image_name: string;
        thumbnail_image_name: string;
        base_price: number;
        promotion_price: number;
        discount_amount: number;
        discount_percent: number | null;
        order: number;
        status: number;
        adults_only: number;
        recommended: boolean;
        type: string;
        vat: number;
        tax_id: number;
        time_out_of_stock: string | null;
        created_at: string;
        updated_at: string;
        itemCd: string;
        master_menu_id: number;
        menuCategory: {
          id: number;
          status: number;
          order: number;
          name: string;
          name_en: string;
          name_zh: string;
          name_ko: string;
          name_fr: string;
          name_ru: string;
          name_ja: string;
          name_vi: string;
          name_th: string;
          merchant_id: number;
          created_at: string;
          updated_at: string;
          use_showing_hours: number;
          showing_hours: string | null;
          available_time_id: number | null;
          available_times: string | null;
        };
        icons: any[];
        outlet: any; // Already defined above, so to avoid recursion we can reuse outlet type or mark as any
        addon_item_details: any[];
      };
      cart_addon_items: any[];
      menu_item_id: number;
      qty: number;
      note: string;
      cart_id: number;
      id: number;
      created_at: string;
      updated_at: string;
      base_price: number;
      promotion_price: number;
      formated_addon_items: string;
      is_happy_hour_product: boolean;
    }[];
    total_custom_vat: number;
    final_total: number;
  };
};

// add to cart response

// menu add on response

export type MenuAddOnItemResponse = {
  status: boolean;
  data: {
    id: number;
    category_id: number;
    name: string;
    name_en: string;
    name_zh: string;
    name_ko: string;
    name_fr: string;
    name_ru: string;
    name_ja: string;
    name_vi: string;
    name_th: string;
    description: string;
    description_en: string;
    description_zh: string;
    description_ko: string;
    description_fr: string;
    description_ru: string;
    description_ja: string;
    description_vi: string;
    description_th: string;
    notes: string | null;
    image_name: string;
    thumbnail_image_name: string;
    base_price: number;
    promotion_price: number;
    status: number;
    adults_only: number;
    recommended: boolean;
    type: string;
    time_out_of_stock: string | null;
    itemCd: string;
    menuCategory: {
      use_showing_hours: number;
      showing_hours: string | null;
      available_times: string | null;
    };
    addon_categories: {
      id: number;
      name: string;
      required: number;
      maximum_purchase: number;
      minimum_purchase: number | null;
      items: {
        id: number;
        status: number;
        price: number;
        name: string;
        name_vi: string;
        name_th: string;
        minimum_purchase: number;
        maximum_purchase: number;
        addon_category_id: number;
        master_addon_id: number;
      }[];
    }[];
    discount_percent: number;
    icons: any[];
    brand: string | null;
  };
};

// menu add on response

// merchant-outlets

export type MerchantOutletsResponse = {
  status: boolean;
  data: {
    type: string;
    data: {
      name: string;
      outlets: {
        id: number;
        name: string;
        short_name: string;
        address: string;
        address_en: string;
        image: string;
        joinedDeliveryProgram: boolean;
        joinedContactlessProgram: boolean;
        enableTableBooking: boolean;
        distance: number;
      }[];
      isExistKolOffer: boolean;
      enableMarketingProgram: boolean;
      numberOfDeals: number;
      numberOfStampDeals: number;
      bannerDeal: string;
    };
  };
};

// merchant-outlets

// promoition

export type PromotionCodeResponse = {
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    name_en: string;
    code: string;
    status: string;
    hidden: number;
    default_qty_per_merchant: number;
    max_used_times_per_user: number;
    discount_percent: number | null;
    discount_value: number | null;
    max_discount: number | null;
    discount_type: string;
    min_required_subtotal: number;
    savyu_sponsor_percent: number;
    merchant_sponsor_percent: number;
    description: string;
    description_en: string;
    image_name: string;
    valid_from: string;
    valid_to: string;
    created_at: string;
    updated_at: string;
    delivery_first_time: number;
    apply_for_delivery: boolean;
    apply_for_contactless: boolean;
    apply_for_deal: boolean;
    email_domain_name: string | null;
    required_email: boolean;
    isAllowedSendPromotionCodeToEmail: boolean;
    minBillValueToSendPromotionCodeToEmail: number;
    maxSendPerUser: number | null;
    payment_methods: {
      id: number;
      name: string;
      status: string;
      key: string;
      created_at: string;
      updated_at: string;
    }[];
    suitable: boolean;
  }[];
};

// Order Detail Types - Comprehensive type definitions for order detail response
export * from "./order-detail";

//

export type OrdersResponse = {
  status: boolean;
  data: {
    items: {
      qty: number;
      distance: number;
      shipping_tip: number;
      is_web: number;
      type: string;
      discountDetails: any[]; // could be more specific if you know the structure
      id: number;
      final_total: number;
      status: string;
      created_at: string;
      outlet: {
        approved: number;
        id: number;
        name: string;
        short_name: string;
        merchant: {
          approved: number;
          allow_invite_friend: number;
          language: string;
          id: number;
          name: string;
          logo_image: string;
          sub_domain: string;
        };
        outlet_images: {
          id: number;
          status: number;
          image_path: string;
          image_name: string;
          created_at: string;
        }[];
      };
    }[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
};

// Order Detail Types - Comprehensive type definitions for order detail response
export * from "./order-detail";

//

// Banner

export type BannerResponse = {
  status: boolean;
  data: {
    id: number;
    image: string;
    title: string;
    titleColor: string;
    subtitle: string;
    subtitleColor: string;
    ctaButtonTitle: string;
    ctaButtonTitleColor: string;
    ctaButtonUrl: string | null;
    merchants: {
      id: number;
      name: string;
      image: string;
      subDomain: string;
      address: {
        city: string;
        cityEn: string;
        district: string;
        districtEn: string;
        ward?: string;
        wardEn?: string;
        address: string;
      };
      hierarchicalCategories: any[];
      joinedDelivery: boolean;
      joinedContactless: boolean;
      joinedTableBooking: boolean;
      outlets: {
        id: number;
        name: string;
        shortName: string;
        joinedDelivery: boolean;
        joinedContactless: boolean;
        joinedTableBooking: boolean;
        address: {
          city: string;
          cityEn: string;
          district: string;
          districtEn: string;
          ward?: string;
          wardEn?: string;
          address: string;
        };
      }[];
    }[];
  }[];
};
