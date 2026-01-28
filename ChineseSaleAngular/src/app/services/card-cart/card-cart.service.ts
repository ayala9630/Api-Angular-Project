import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardCart, CreateCardCart } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class CardCartService {
  private readonly url = `${environment.apiUrl}/cardcart`;

  constructor(private http: HttpClient) { }

  getCardCartsByUserId(userId: number): Observable<CardCart[]> {
    return this.http.get<CardCart[]>(this.url, {
      params: { userId }
    });
  }

  createCardCart(cardCart: CreateCardCart): Observable<number> {
    return this.http.post<number>(this.url, cardCart);
  }

  updateCardCart(cardCart: CardCart): Observable<void> {
    return this.http.put<void>(this.url, cardCart);
  }

  deleteCardCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
