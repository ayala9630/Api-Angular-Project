import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';
import { Lottery, CreateLottery, UpdateLottery, User } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {
  private readonly baseUrl = `${environment.apiUrl}/Lottery`;

  constructor(private http: HttpClient) { }

  getAllLotteries(): Observable<Lottery[]> {
    return this.http.get<Lottery[]>(this.baseUrl);
  }

  getLotteryById(id: number): Observable<Lottery> {
    return this.http.get<Lottery>(`${this.baseUrl}/${id}`);
  }

  addLottery(lottery: CreateLottery): Observable<Lottery> {
    return this.http.post<Lottery>(this.baseUrl, lottery);
  }

  updateLottery(lottery: UpdateLottery): Observable<void> {
    return this.http.put<void>(this.baseUrl, lottery);
  }

  deleteLottery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  drawWinners(giftId: number): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/DrawWinners/${giftId}`, {});
  }
  lottery(giftId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/giftId/${giftId}`, {});
  }

  exportLotteryReport(lotteryId: number, format: 'csv' | 'json' | 'pdf'): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}/${lotteryId}/report/export`, {
      params: { format },
      observe: 'response',
      responseType: 'blob'
    });
  }
}
