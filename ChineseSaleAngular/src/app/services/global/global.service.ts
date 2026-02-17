import { Injectable, NgZone, signal, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse, Lottery, User } from '../../models';
import { CookieService } from 'ngx-cookie-service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  msg: NzMessageService = inject(NzMessageService);
  currentLottery = signal<Lottery | null>(null);
  currentLotteryId = computed(() => this.currentLottery()?.id || 0);
  lotteryStarted = computed(() => (new Date(this.currentLottery()?.startDate || new Date())).getTime() <= new Date().getTime())
  lotteryFinished = computed(() => (new Date(this.currentLottery()?.endDate || new Date())).getTime() <= new Date().getTime())
  user = signal<User | null>(null);
  timeToLotteryStart = computed(() => {
    const startDate = this.currentLottery()?.startDate;
    if (!startDate) return 0;
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    if(start <= now) {
      this.lotteryStart = true;
    }
    return Math.max(0, start - now);
  });
  timeToLotteryEnd = computed(() => {
    const endDate = this.currentLottery()?.endDate;
    if (!endDate) return 0;
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    return Math.max(0, end - now);
  });
  lotteryStart: boolean = computed(() => !this.lotteryStarted())();

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
  public logout() {
    // 1. נקה את העוגיה של auth_token
    this.cookieService.delete('auth_token');

    // 2. עדכן את מצב החיבור ל- false
    this.setConnected(false);

    // 3. עצור את מעקב העוגיות אם הוא פעיל
    this.stopCookieWatcher();
  }

  public login(response: LoginResponse) {
    // 1. שמור את ה-token בעוגיה
    this.cookieService.set('auth_token', response.token);
    this.cookieService.set('user', JSON.stringify(response.user));
    this.user.set(response.user);
    // 2. עדכן את מצב החיבור ל- true
    this.setConnected(true);
    // 3. (אופציונלי) אם יש צורך, תוכל להפעיל מחדש את מעקב העוגיות
    // this.startCookieWatcher();
}
}
