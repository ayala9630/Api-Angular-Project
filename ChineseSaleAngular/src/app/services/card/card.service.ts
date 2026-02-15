import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, CreateCard } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private readonly url = `${environment.apiUrl}/card`;

  constructor(private http: HttpClient) { }

  getCardsByLotteryId(lotteryId: number): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.url}/lottery/${lotteryId}`);
  }

  getCardByGiftId(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.url}/${id}`);
  }

  getCardsWithPagination(lotteryId: number, pageNumber: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<any>(`${this.url}/pagination/${lotteryId}`, { params });
  }

  getCardsWithPaginationSorted(lotteryId: number, pageNumber?: number, pageSize?: number, sortType?: 'value' | 'purchases', ascending?: boolean): Observable<any> {
    let queryParams = '?';
    if (sortType !== undefined && ascending !== undefined)
      queryParams += `&sortType=${sortType}&ascending=${ascending}`;
    if (pageNumber !== undefined && pageSize !== undefined)
      queryParams += `&pageNumber=${pageNumber}&pageSize=${pageSize}`;  
    console.log(queryParams);
      
    return this.http.get<any>(`${this.url}/pagination/sorted/${lotteryId}/${queryParams}`,
    );
  }

  getCardsWithPaginationSortByPurchases(lotteryId: number, pageNumber: number, pageSize: number, ascending: boolean): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('ascending', ascending);
    return this.http.get<any>(`${this.url}/pagination/sortByPurchases/${lotteryId}`, { params });
  }

  createCard(card: CreateCard): Observable<number> {
    return this.http.post<number>(this.url, card);
  }

  resetWinnersByLotteryId(lotteryId: number): Observable<void> {
    return this.http.put<void>(`${this.url}?lotteryId=${lotteryId}`, {});
  }
}
