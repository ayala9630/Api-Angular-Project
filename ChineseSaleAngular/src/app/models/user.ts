import { Address, CreateAddressForUser } from './address';

export interface CreateUser {
  username: string;
  password: string;
  firstName?: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: CreateAddressForUser;
}

export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  isAdmin?: boolean;
}

export interface UpdateUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: Address;
}
