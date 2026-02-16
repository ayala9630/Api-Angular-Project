import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package, CreatePackage, UpdatePackage, PackageCarts } from '../../models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private readonly url = `${environment.apiUrl}/package`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  getPackageById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.url}/${id}`);
  }
  getPackageForUpdate(id: number): Observable<UpdatePackage> {
    return this.http.get<UpdatePackage>(`${this.url}/id/${id}/update`);
  }

  getPackagesByLotteryId(lotteryId: number): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.url}/lottery/${lotteryId}`);
  }

  addPackage(packageData: CreatePackage): Observable<number> {
    return this.http.post<number>(this.url, packageData);
  }

  updatePackage(packageData: UpdatePackage): Observable<void> {
    return this.http.put<void>(this.url, packageData);
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(this.url, {
      params: { id }
    });
  }
  //Aditional functions
  packageCart: PackageCarts[] = [];
    updateQty(packageId: number, qty: number): void {
    const existingCartItem = this.packageCart.find(item => item.packageId === packageId);
    if (existingCartItem) {
      existingCartItem.quantity += qty;
      if (existingCartItem.quantity <= 0) {
        this.packageCart = this.packageCart.filter(item => item.packageId !== packageId);
      }
    }
    else if (qty > 0) {
      this.packageCart.push({ packageId: packageId, quantity: qty });
    }
    this.cookieService.set('packageCartUser1', JSON.stringify(this.packageCart), 7);
  }

  getPackageQuantity(packageId: number): number {
    const existingCartItem = this.packageCart.find(item => item.packageId === packageId);
    return existingCartItem ? existingCartItem.quantity : 0;
  }

}
