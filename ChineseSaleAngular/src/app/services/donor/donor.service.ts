import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donor, CreateDonor, UpdateDonor } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private readonly url = `${environment.apiUrl}/donor`;

  constructor(private http: HttpClient) { }

  getAllDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.url);
  }

  getDonorById(id: number, lotteryId: number, pageNumber: number = 1, pageSize: number = 10): Observable<Donor> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<Donor>(`${this.url}/${lotteryId}/${id}`, { params });
  }
  getDonorByIdSimple(id: number, lotteryId: number) {
    return this.http.get<Donor>(`${this.url}/lottery:${lotteryId}/${id}`)
  }
  getDonorByLotteryId(lotteryId: number): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.url}/${lotteryId}`);
  }

  getDonorsWithPagination(lotteryId: number, pageNumber: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<any>(`${this.url}/lottery/${lotteryId}/pagination`, { params });
  }

  getDonorsSearchPagination(lotteryId: number, pageNumber: number, pageSize: number, searchText?: string, searchType?: 'name' | 'email'): Observable<any> {
    let queryParams = `?lotteryId=${lotteryId}`;
    queryParams += `&pageNumber=${pageNumber}`;
    queryParams += `&pageSize=${pageSize}`;
    if (searchText) {
      if (searchType === 'email') {
        queryParams += `&email=${searchText}`;
      }
      else {
        queryParams += `&name=${searchText}`;
      }
    }
    return this.http.get<any>(`${this.url}/lottery/${lotteryId}/search${queryParams}`);
  }

  addDonor(donor: CreateDonor): Observable<number> {
    return this.http.post<number>(this.url, donor);
  }

  updateDonor(donor: UpdateDonor): Observable<void> {
    return this.http.put<void>(this.url, donor);
  }

  addLotteryToDonor(donorId: number, lotteryId: number): Observable<void> {
    return this.http.put<void>(`${this.url}/lottery/${lotteryId}/id/${donorId}`, {});
  }

  deleteDonor(id: number, lotteryId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/lottery/${lotteryId}/id/${id}`);
  }
}
