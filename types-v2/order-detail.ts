// Order Detail Response Type based on the provided JSON data

export type OrderDetailResponse = {
  status: boolean;
  message: string;
  data: OrderDetailData;
};

export type OrderDetailData = {
  qty: number;
  distance: number;
  shipping_tip: number;
  is_web: number;
  type: string;
  discountDetails: any[];
  id: number;
  user_id: number;
  outlet_id: number;
  cart_id: number;
  transaction_code: number;
  shipping_service: string | null;
  shipping_code: string | null;
  ahamove_shipping_code: string | null;
  lalamove_shipping_code: string | null;
  be_shipping_code: string | null;
  xanhSMShippingCode: string | null;
  truemoneyShippingCode: string | null;
  old_shipping_code: string | null;
  fullname: string;
  phone: string;
  location: OrderLocation;
  address_note: string;
  note: string;
  contactless_notes: string | null;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  other_fee: number;
  total_fee: number;
  final_total: number;
  system_fee: number;
  total_custom_vat: number;
  applicable_fees: ApplicableFee[];
  mca: number;
  payment_gateway: string;
  payment: PaymentInfo;
  reward: any;
  shipping: any;
  status: string;
  merchant_status: string;
  shipping_status: string | null;
  cancel_by: string | null;
  cancel_reason: string | null;
  cancel_detail: string | null;
  rejected_times: number | null;
  meta: OrderMeta;
  timelines: OrderTimelines;
  rating: string | null;
  rating_description: string | null;
  processing_at: string | null;
  user_tmp_uuid: string | null;
  created_at: string;
  updated_at: string;
  paid: number;
  alias_code: string | null;
  is_printed: number;
  person_in_charge_id: number | null;
  offer_id: number | null;
  printedAt: string | null;
  pickUpTime: string | null;
  assignedAt: string | null;
  driverAcceptedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  merchantReadAt: string | null;
  usdToKhrExchangeRate: number;
  outsideShippingPartnerTracking: string | null;
  items: OrderItem[];
  promoCodes: any[];
  generatedPromotionCodes: any[];
  user: OrderUser;
  outlet: OrderOutlet;
  items_history: any[];
  timelines_html: string;
  new_timelines: NewTimeline[];
  payment_gateway_translation: string;
  consumer_timelines: { [key: string]: string };
  secret: boolean;
  vat: number;
  user_loyalty_info: UserLoyaltyInfo;
};

export type OrderLocation = {
  id: string;
  lat: number;
  long: number;
  address: string;
};

export type ApplicableFee = {
  title: string;
  value: number;
  position: number;
};

export type PaymentInfo = {
  amount: string;
  gateway: string;
  language: string;
  payment_key: string;
  vnpt_pay_type: string;
  transaction_code: number;
};

export type OrderMeta = {
  vat: number;
  host: string;
  note: string;
  accept: string;
  "cf-ray": string;
  origin: string;
  reward: number;
  referer: string;
  "cdn-loop": string;
  eta_time: number;
  priority: string;
  receiver: {
    phone: string;
    fullname: string;
  };
  settings: {
    maximum_reward: number | null;
    reward_percent: number;
    default_eta_time: number;
    extra_fee_percent: number;
    service_fee_percent: number | null;
    service_fee_based_on: string;
    fixed_cashback_first_time: number;
  };
  bill_info: {
    mca: string;
    vat: number;
    reward_vat: number;
    system_fee: number;
    service_fee: number;
    service_fee_vat: number;
    service_fee_not_vat: number;
  };
  "sec-ch-ua": string;
  "cf-visitor": string;
  connection: string;
  enable_eta: boolean;
  quotations: {
    details: {
      distance: number;
      totalFee: number;
    }[];
    distance: number;
    duration: number;
    totalFee: number;
  };
  reward_vat: number;
  browserName: string;
  service_fee: number;
  address_note: string;
  "cf-ipcountry": string;
  "content-type": string;
  serviceFeeKol: number;
  "content-length": string;
  isCircleKOrder: boolean;
  originSubtotal: number;
  "sec-fetch-dest": string;
  "sec-fetch-mode": string;
  "sec-fetch-site": string;
  "accept-encoding": string;
  "accept-language": string;
  service_fee_vat: number;
  isCircleKWebView: boolean;
  "sec-ch-ua-mobile": string;
  estimated_arrival: number;
  info_for_customer: {
    title: string;
    key: string;
    value: number;
  }[];
  info_for_merchant: {
    title: string;
    key: string;
    value: number;
  }[];
  user_loyalty_info: {
    totalGmv: number;
    lastVisit: string | null;
    totalTransactions: number;
  };
  "x-forwarded-proto": string;
  isSevenElevenOrder: boolean;
  "sec-ch-ua-platform": string;
  service_fee_not_vat: number;
  payment_trxn_fee_vat: number;
  hasUseCampaignDiscount: boolean;
  hasUseCustomDiscounted: boolean;
  sentPurchasedEventToGGA: boolean;
  merchant_applicable_fees: any[];
  payment_trxn_fee_not_vat: number;
  extra_payment_trxn_fee_vat: number;
  extra_payment_trxn_fee_not_vat: number;
};

export type OrderTimelines = {
  consumer: {
    status: string;
    datetime: string;
  }[];
  merchant: {
    status: string;
    datetime: string;
  }[];
  shipping: any[];
};

export type OrderItem = {
  id: number;
  order_id: number;
  menu_item_id: number;
  qty: number;
  note: string;
  base_price: number;
  final_price: number;
  created_at: string;
  updated_at: string;
  isCompensationProduct: number;
  promotionQty: number;
  vat: number;
  finalTotal: number;
  menuItem: MenuItem;
  order_addon_items: OrderAddonItem[];
  order_discounted_product: {
    id: number;
    order_item_id: number;
    discounted_product_id: number;
    itemCd: string;
    selling_price: number;
  } | null;
  order_custom_discounted_product: any;
  promotionOrderItem: any;
  promotion_price?: number;
  formated_addon_items: string;
  is_happy_hour_product: boolean;
};

export type MenuItem = {
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
  discount_amount: number | null;
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
  menuCategory: MenuCategory;
  icons: any[];
};

export type MenuCategory = {
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

export type OrderAddonItem = {
  id: number;
  qty: number;
  base_price: number;
  final_price: number;
  order_item_id: number;
  addon_detail_id: number;
  created_at: string;
  updated_at: string;
  vat: number;
  addon_item_detail: AddonItemDetail;
  addon_item: AddonItemDetail;
};

export type AddonItemDetail = {
  id: number;
  status: number;
  time_out_of_stock: string | null;
  price: number;
  outlet_id: number;
  addon_id: number | null;
  vat: number;
  tax_id: number;
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
  minimum_purchase: number;
  maximum_purchase: number;
  addon_category_id: number;
  created_at: string;
  updated_at: string;
  itemCd: string;
  master_addon_id: number;
  category: {
    id: number;
    name: string;
    name_en: string;
    name_zh: string;
    name_ko: string;
    name_fr: string;
    name_ru: string;
    name_ja: string;
    required: number;
  };
};

export type OrderUser = {
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
  pin: string | null;
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
  identifier: string | null;
};

export type OrderOutlet = {
  approved: number;
  id: number;
  merchant_id: number;
  status: number;
  name: string;
  address: {
    address: string;
    district: string;
    ward: string;
    city: string;
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
  merchant: OrderMerchant;
  outlet_images: {
    id: number;
    status: number;
    image_path: string;
    image_name: string;
    created_at: string;
  }[];
  is_opening: boolean;
};

export type OrderMerchant = {
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

export type NewTimeline = {
  datetime: string;
  status: {
    consumer: {
      status: string;
      datetime: string;
    }[];
    merchant: {
      status: string;
      datetime: string;
    }[];
    shipping: any[];
  };
};

export type UserLoyaltyInfo = {
  totalGmv: number;
  lastVisit: string | null;
  totalTransactions: number;
};
