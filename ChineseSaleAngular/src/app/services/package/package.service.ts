import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package, CreatePackage, UpdatePackage } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private readonly url = `${environment.apiUrl}/package`;

  constructor(private http: HttpClient) { }

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
}
