export interface PackageCart {
  id: number;
  quantity: number;
  userId: number;
  packageName: string;
  packageUrl: string;
  price: number;
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
