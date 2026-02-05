export interface Address {
  id: number;
  city: string;
  street: string;
  number?: number;
  zipCode?: number;
}

export interface CreateAddress {
  city: string;
  street: string;
  number?: number;
  zipCode?: number;
}

export interface CreateAddressForDonor {
  city: string;
  street: string;
  number?: number;
  zipCode?: number;
}
