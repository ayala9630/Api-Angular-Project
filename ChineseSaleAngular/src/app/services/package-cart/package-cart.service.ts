import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackageCart, CreatePackageCart, UpdateQuantity } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class PackageCartService {
  private readonly url = `${environment.apiUrl}/packagecart`;

  constructor(private http: HttpClient) { }

  getPackageCartByUserId(userId: number): Observable<PackageCart[]> {
    return this.http.get<PackageCart[]>(this.url, {
      params: { userId }
    });
  }

  createPackageCart(packageCart: CreatePackageCart): Observable<number> {
    return this.http.post<number>(this.url, packageCart);
  }

  updatePackageCart(packageCart: PackageCart): Observable<void> {
    return this.http.put<void>(this.url, packageCart);
  }

  deletePackageCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
