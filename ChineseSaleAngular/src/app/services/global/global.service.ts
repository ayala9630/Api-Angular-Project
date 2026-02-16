import { Injectable, NgZone, signal, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lottery } from '../../models';
import { CookieService } from 'ngx-cookie-service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  msg:NzMessageService = inject(NzMessageService);        
  currentLottery = signal<Lottery | null>(null);
  currentLotteryId = computed(() => this.currentLottery()?.id || 0);
  lotteryStarted = computed(() => (new Date(this.currentLottery()?.startDate || new Date())).getTime() <= new Date().getTime())
  lotteryFinished = computed(() => (new Date(this.currentLottery()?.endDate || new Date())).getTime() <= new Date().getTime())

  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  private cookieWatcherIntervalMs = 1000;
  private cookieWatcherId: any = null;

  constructor(private cookieService: CookieService, private ngZone: NgZone) {
    this.connectedSubject.next(this.hasAuthCookie());

    this.ngZone.runOutsideAngular(() => {
      this.cookieWatcherId = setInterval(() => {
        const has = this.hasAuthCookie();
        if (has !== this.connectedSubject.value) {
          this.ngZone.run(() => this.connectedSubject.next(has));
        }
      }, this.cookieWatcherIntervalMs);
    });
  }

  private hasAuthCookie(): boolean {
    try {
      const token = this.cookieService.get('auth_token');
      return !!token;
    } catch {
      return false;
    }
  }

  public setConnected(value: boolean) {
    if (value !== this.connectedSubject.value) {
      this.connectedSubject.next(value);
    }
  }

  public isConnected(): boolean {
    return this.connectedSubject.value;
  }

  public stopCookieWatcher() {
    if (this.cookieWatcherId) {
      clearInterval(this.cookieWatcherId);
      this.cookieWatcherId = null;
    }
  }
}
