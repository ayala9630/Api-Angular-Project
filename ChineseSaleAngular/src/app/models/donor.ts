import { Address, CreateAddressForDonor } from './address';

export interface Donor {
  id: number;
  firstName?: string;
  lastName?: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyIcon?: string;
  companyAddressId: number;
}

export interface SingleDonor {
  id: number;
  firstName?: string;
  lastName?: string;
  companyName: string;
  companyIcon?: string;
  gifts?: { [key: string]: number };
}

export interface CreateDonor {
  firstName?: string;
  lastName?: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyIcon?: string;
  companyAddress: CreateAddressForDonor;
}

export interface UpdateDonor {
  id: number;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyIcon?: string;
  companyAddressId?: number;
}
