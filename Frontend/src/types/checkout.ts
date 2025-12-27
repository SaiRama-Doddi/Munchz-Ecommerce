// types/checkout.ts
export interface Variant {
  id: number;
  skuId: string;
  weightLabel: string;
  offerPrice: number;
}

export interface CartItem {
  productId: number;
  name: string;
  imageUrl: string;
  qty: number;
  selectedVariantIndex: number;
  variants: Variant[];
}

export interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  mobile?: string;
  isDefault: boolean;
}
