export interface CardCart {
  id: number;
  quantity: number;
  userId: number;
  giftId: number;
  giftName: string;
  imageUrl: string;
  price: number;
  isPackageAble: boolean;
}
export interface Cart {
  userId:number
  userCart:CardCart[];
}

export interface CardCarts {
  giftId: number;
  quantity: number;
}

export interface CreateCardCart {
  id: number;
  quantity: number;
  userId: number;
  giftId: number;
}