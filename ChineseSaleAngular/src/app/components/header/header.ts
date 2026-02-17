import { Component, OnDestroy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LotteryService } from '../../services/lottery/lottery.service';
import { Lottery, User } from '../../models';
import { GlobalService } from '../../services/global/global.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-header',
  imports: [RouterModule, NzIconModule, NzMenuModule, FormsModule, NzSelectModule, DatePipe],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  constructor(
    private lotteryService: LotteryService,
    public global: GlobalService,
    private cookieService: CookieService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  lotteryData: Lottery[] = [];
  selectedLottery: Lottery | undefined;
  user: User | null = null;
  conected: boolean = false;
  admin: boolean = true;

  // timer fields
  lotteryStart: boolean = false; // true when lottery started
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  private timerId: any = null;

  ngOnInit() {
    this.subscriptions.add(
      this.global.connected$.subscribe(value => {
        this.conected = value;
        if (value) {
          const user = this.cookieService.get('user');
          if (user) {
            try { this.user = JSON.parse(user); } catch { this.user = null; }
          }
        } else {
          this.user = null;
        }
      })
    );

    this.lotteryService.getAllLotteries().subscribe({
      next: (data) => {
        this.lotteryData = data;
        this.selectedLottery = this.lotteryData[this.lotteryData.length - 1];
        this.global.currentLottery.set(this.selectedLottery);

        // update timer immediately after we set the current lottery
        this.updateTimerOnce();

        const user = this.cookieService.get('user');
        if (user) {
          this.user = JSON.parse(user);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.global.msg.error('הסשן שלך פג, אנא התחבר מחדש');
          this.global.setConnected(false);
          this.router.navigate(['/login']);
        } else if (err.status === 404) {
          this.global.msg.error('לא נמצאו הגרלות');
        } else {
          this.global.msg.error('אירעה שגיאה בטעינת הגרלות');
        }
      }
    });

    // set initial values (may be zeros until lottery arrives)
    this.updateTimerOnce();

    // run the interval outside Angular to avoid excessive CD cycles
    this.ngZone.runOutsideAngular(() => {
      this.timerId = setInterval(() => {
        // read current lottery directly from the signal
        const current = this.global.currentLottery();
        if (!current || (!current.startDate && !current.endDate)) {
          // nothing to show
          this.ngZone.run(() => {
            this.lotteryStart = false;
            this.days = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
            this.cdr.detectChanges();
          });
          return;
        }

        const now = Date.now();
        const start = current.startDate ? new Date(current.startDate).getTime() : now;
        const end = current.endDate ? new Date(current.endDate).getTime() : now;

        const started = now >= start;
        const remainingMs = started ? Math.max(0, end - now) : Math.max(0, start - now);
        let totalSeconds = Math.floor(remainingMs / 1000);

        const days = Math.floor(totalSeconds / (24 * 3600));
        totalSeconds %= 24 * 3600;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        // update component inside Angular and force CD
        this.ngZone.run(() => {
          this.lotteryStart = started;
          this.days = days;
          this.hours = hours;
          this.minutes = minutes;
          this.seconds = seconds;
          this.cdr.detectChanges();
        });
      }, 1000);
    });
  }

  // initial update inside Angular
  private updateTimerOnce(): void {
    const current = this.global.currentLottery();
    if (!current || (!current.startDate && !current.endDate)) {
      this.lotteryStart = false;
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.cdr.detectChanges();
      return;
    }

    const now = Date.now();
    const start = current.startDate ? new Date(current.startDate).getTime() : now;
    const end = current.endDate ? new Date(current.endDate).getTime() : now;

    const started = now >= start;
    const remainingMs = started ? Math.max(0, end - now) : Math.max(0, start - now);
    let totalSeconds = Math.floor(remainingMs / 1000);

    this.days = Math.floor(totalSeconds / (24 * 3600));
    totalSeconds %= 24 * 3600;
    this.hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    this.minutes = Math.floor(totalSeconds / 60);
    this.seconds = Math.floor(totalSeconds % 60);
    this.lotteryStart = started;

    this.cdr.detectChanges();
  }

  lotteryChange(value: Lottery): void {
    this.selectedLottery = value;
    this.global.currentLottery.set(this.selectedLottery);

    // update immediate after user changes selection
    this.updateTimerOnce();
  }

  isLotteryNotStarted(lottery: Lottery): boolean {
    return new Date(lottery.startDate).getTime() > Date.now();
  }

  editLottery(lottery: Lottery): void {
    this.router.navigate(['/lottery/edit', lottery.id]);
  }

  deleteLottery(lottery: Lottery): void {
    if (!this.isLotteryNotStarted(lottery)) {
      return;
    }

    const confirmed = window.confirm('האם למחוק את ההגרלה?');
    if (!confirmed) {
      return;
    }

    this.lotteryService.deleteLottery(lottery.id).subscribe({
      next: () => {
        this.lotteryData = this.lotteryData.filter(item => item.id !== lottery.id);
        if (this.selectedLottery?.id === lottery.id) {
          this.selectedLottery = this.lotteryData[this.lotteryData.length - 1];
          this.global.currentLottery.set(this.selectedLottery ?? null);
        }
        this.global.msg.success('ההגרלה נמחקה בהצלחה');
      },
      error: () => {
        this.global.msg.error('שגיאה במחיקת ההגרלה');
      }
    });
  }

  logout(): void {
    this.cookieService.delete('auth_token');
    this.cookieService.delete('user');
    this.global.user.set(null);
    this.global.setConnected(false);
    this.conected = this.global.isConnected();
    this.user = null;
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}