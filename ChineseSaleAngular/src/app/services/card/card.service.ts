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

  getCardsWithPaginationSortByValue(lotteryId: number, pageNumber: number, pageSize: number, ascending: boolean): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('ascending', ascending);
    return this.http.get<any>(`${this.url}/pagination/sortByValue/${lotteryId}`, { params });
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
