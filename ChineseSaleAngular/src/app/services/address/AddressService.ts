import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { AddressDto, CreateAddressForDonor, CreateAddressForUser } from '../../models';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly baseUrl = `${environment.apiUrl}/address`;

  constructor(private http: HttpClient) {}

  getAddressById(id: number) {
    return this.http.get<AddressDto>(`${this.baseUrl}/${id}`);
  }

  addAddressForUser(payload: CreateAddressForUser) {
    return this.http.post<number>(`${this.baseUrl}/user`, payload);
  }

  addAddressForDonor(payload: CreateAddressForDonor) {
    return this.http.post<number>(`${this.baseUrl}/donor`, payload);
  }

  updateAddress(payload: AddressDto) {
    return this.http.put<void>(`${this.baseUrl}`, payload);
  }
}