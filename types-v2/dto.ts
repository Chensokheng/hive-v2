export type OutletUnpaidItemsDto = {
  cartId: number;
  totalQuantity: number;
  subtotal: number;
  finalTotal: number;
  otherFee: number;
  shippingFee: number;
  distance: number;
  totalVat: number;
  userInfo: {
    userId: number;
    name: string;
    phone: string;
  };
  items: {
    id: number;
    outletId: number;
    menuItemId: number;
    quantity: number;
    basePrice: number;
    promotionPrice: number;
    note: string;
    formatedAddonItems: string;
    cartAddonItems: any[];
    image: string;
    nameEn: string;
    name: string;
    cartDiscountedProduct: {
      discountedProductId: number;
      itemCd: string;
      sellingPrice: number;
      cartItemId: number;
      id: number;
    } | null;
    promotionCartItem: {
      promotionProductId: number;
      price: number;
      cartItemId: number;
      id: number;
    } | null;
  }[];
};
