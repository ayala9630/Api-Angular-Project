import { User } from './user';

export interface ListCard {
  giftName: string;
  imageUrl: string;
  quantity: number;
  giftId: number;
  giftValue?: number;
  winUser: User;
}

export interface Card {
  giftId: number;
  giftName?: string;
  cardPurchases?: { [key: string]: number };
}

export interface CreateCard {
  userId: number;
  giftId: number;
}

export interface UpdateCard {
  id: number;
  isWin?: boolean;
}
