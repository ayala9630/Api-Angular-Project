import { Injectable } from '@angular/core';
import { environment } from '../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gift, GiftWithOldPurchase, PaginatedResult } from '../models';

@Injectable({
  providedIn: 'root'
})

export class GiftService {
  private readonly url = `${environment.apiUrl}/gift`;

  constructor(private http: HttpClient) { }

  getGifts():Observable<PaginatedResult<GiftWithOldPurchase[]>> {
    return this.http.get<PaginatedResult<GiftWithOldPurchase[]>>(`${this.url}/lottery/2/pagination`);
    // return this.http.get<PaginatedResult<Gift[]>>("http://localhost:5025/api/Gift/lottery/2/pagination");
  }

}
