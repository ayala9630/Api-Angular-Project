import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lottery, CreateLottery, UpdateLottery } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {
  private readonly url = `${environment.apiUrl}/lottery`;

  constructor(private http: HttpClient) { }

  getAllLotteries(): Observable<Lottery[]> {
    return this.http.get<Lottery[]>(this.url);
  }

  getLotteryById(id: number): Observable<Lottery> {
    return this.http.get<Lottery>(`${this.url}/${id}`);
  }

  addLottery(lottery: CreateLottery): Observable<Lottery> {
    return this.http.post<Lottery>(this.url, lottery);
  }

  updateLottery(lottery: UpdateLottery): Observable<void> {
    return this.http.put<void>(this.url, lottery);
  }

  deleteLottery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  drawWinners(giftId: number): Observable<string> {
    return this.http.put<string>(`${this.url}/DrawWinners/${giftId}`, {});
  }
}
