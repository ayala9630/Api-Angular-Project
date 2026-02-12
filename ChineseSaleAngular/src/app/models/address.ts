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
  number: number | null;
  zipCode: number | null;
}

export interface AddressDto extends CreateAddress {
  id: number;
}

export interface CreateAddressForUser extends CreateAddress {
  userId: number;
}

export interface CreateAddressForDonor extends CreateAddress {
  donorId: number;
}
