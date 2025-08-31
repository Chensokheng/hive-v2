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
    image: string;
    nameEn: string;
    name: string;
  }[];
};
