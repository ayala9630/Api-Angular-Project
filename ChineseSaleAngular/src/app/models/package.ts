export interface Package {
  id: number;
  name: string;
  description?: string;
  numOfCards: number;
  price: number;
  LotteryId: number;
}

export interface CreatePackage {
  name: string;
  description?: string;
  numOfCards: number;
  price: number;
  LotteryId: number;
}

export interface UpdatePackage {
  id: number;
  name?: string;
  description?: string;
  numOfCards?: number;
  price?: number;
  LotteryId?: number;
}
