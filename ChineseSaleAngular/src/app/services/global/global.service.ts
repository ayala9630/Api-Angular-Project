import { Injectable, NgZone, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lottery } from '../../models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  currentLottery = signal<Lottery | null>(null);
  currentLotteryId = computed(() => this.currentLottery()?.id || 0);
  lotteryStarted = computed(() => (new Date(this.currentLottery()?.startDate || new Date())).getTime() <= new Date().getTime())
  lotteryFinished = computed(() => (new Date(this.currentLottery()?.endDate || new Date())).getTime() <= new Date().getTime())

  // --- Connected state (Reactive) ---
  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  private cookieWatcherIntervalMs = 1000;
  private cookieWatcherId: any = null;

  constructor(private cookieService: CookieService, private ngZone: NgZone) {
    // אתחול ערך לפי העוגייה ברגע טעינת השירות
    this.connectedSubject.next(this.hasAuthCookie());

    // הפעלת watcher שמעדכן את ה־BehaviorSubject כשמצב העוגייה משתנה.
    // מריצים ב־NgZone.runOutsideAngular כדי לא ליצור הרבה צילומי ChangeDetection
    this.ngZone.runOutsideAngular(() => {
      this.cookieWatcherId = setInterval(() => {
        const has = this.hasAuthCookie();
        if (has !== this.connectedSubject.value) {
          // כשזיהינו שינוי — נכנסים חזרה ל־Angular zone ונפיץ את הערך
          this.ngZone.run(() => this.connectedSubject.next(has));
        }
      }, this.cookieWatcherIntervalMs);
    });
  }

  // בדיקה נוחה אם יש auth token (או כל עוגיה אחרת שתרצה לבדוק)
  private hasAuthCookie(): boolean {
    try {
      const token = this.cookieService.get('auth_token');
      return !!token;
    } catch {
      return false;
    }
  }

  // פונקציה המאפשרת להגדיר את מצב ה־connected ישירות (למשל אחרי login/logout)
  public setConnected(value: boolean) {
    if (value !== this.connectedSubject.value) {
      this.connectedSubject.next(value);
    }
  }

  // מציג את הערך הנוכחי בסינכרון (לשימושים קצרים)
  public isConnected(): boolean {
    return this.connectedSubject.value;
  }

  // אם תרצה - להפסיק את הווטר (לא חובה)
  public stopCookieWatcher() {
    if (this.cookieWatcherId) {
      clearInterval(this.cookieWatcherId);
      this.cookieWatcherId = null;
    }
  }
}
