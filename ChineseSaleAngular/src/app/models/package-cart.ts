export interface PackageCart {
  // id: number;
  quantity: number;
  userId: number;
  packageId: number;
  packageName: string;
  numberOfCards: number;
  imageUrl: string;
  price: number;
}

export interface PackageCartGroup {
  userId: number
  userCart: PackageCart[]
}

export interface PackageCarts {
  packageId: number;
  quantity: number;
}


export interface CreatePackageCart {
  quantity: number;
  userId: number;
  packageId: number;
}

export interface UpdateQuantity {
  id: number;
  quantity: number;
}
