import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateGift, Gift, GiftWithOldPurchase, PaginatedResult, UpdateGift } from '../../models';

@Injectable({
  providedIn: 'root'
})

export class GiftService {
  private readonly url = `${environment.apiUrl}/gift`;

  constructor(private http: HttpClient) { }

  getGifts(
    lotteryId: number,
    userId?: number,
    pageNumber?: number,
    pageSize?: number,
    name?: string,
    donor?: string
  ): Observable<PaginatedResult<GiftWithOldPurchase[]>> {
    let queryParams = `?lotteryId=${lotteryId}`;
    if (userId !== undefined) queryParams += `&userId=${userId}`;
    if (pageNumber !== undefined && pageSize !== undefined)
      queryParams += `&pageNumber=${pageNumber} + &pageSize=${pageSize}`;
    if (name !== undefined) queryParams += `&name=${name}`;
    if (donor !== undefined) queryParams += `&donor=${donor}`;
    return this.http.get<PaginatedResult<GiftWithOldPurchase[]>>(`${this.url}/lottery/${lotteryId}/search-pagination/${queryParams}`);
  }

  getGiftById(id: number): Observable<Gift> {
    return this.http.get<Gift>(`${this.url}/${id}`);
  }

  createGift(gift: CreateGift): Observable<Gift> {
    return this.http.post<Gift>(`${this.url}`, gift);
  }

  UpdateGift(gift: UpdateGift): Observable<Gift> {
    return this.http.put<Gift>(`${this.url}`, gift);
  }

  deleteGift(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}