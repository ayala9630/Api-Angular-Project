import { User } from "./user";

export interface CreateGift {
  name: string;
  description?: string;
  price?: number;
  giftValue?: number;
  imageUrl?: string;
  isPackageAble?: boolean;
  donorId: number;
  categoryId?: number;
  lotteryId: number;
}

export interface UpdateGift {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  giftValue?: number;
  imageUrl?: string;
  isPackageAble?: boolean;
  donorId?: number;
  categoryId?: number;
  lotteryId: number;
}

export interface Gift {
  id: number;
  name: string;
  description?: string;
  price?: number;
  giftValue?: number;
  imageUrl?: string;
  isPackageAble?: boolean;
  companyName?: string;
  companyLogoUrl?: string;
  categoryName?: string;
  lotteryId: number;
  winner?: string;
}

export interface GiftWithOldPurchase {
  id: number;
  name: string;
  price: number;
  giftValue?: number;
  imageUrl?: string;
  isPackageAble?: boolean;
  oldPurchaseCount: number;
  categoryName?: string;
  winner?: string;
}
