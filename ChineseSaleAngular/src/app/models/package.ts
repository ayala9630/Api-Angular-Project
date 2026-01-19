export interface Package {
  id: number;
  name: string;
  description?: string;
  numOfCards: number;
  price: number;
  loterryId: number;
}

export interface CreatePackage {
  name: string;
  description?: string;
  numOfCards: number;
  price: number;
  loterryId: number;
}

export interface UpdatePackage {
  id: number;
  name?: string;
  description?: string;
  numOfCards?: number;
  price?: number;
  loterryId?: number;
}
