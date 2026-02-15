import { Component, OnDestroy } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LotteryService } from '../../services/lottery/lottery.service';
import { Lottery, User } from '../../models';
import { GlobalService } from '../../services/global/global.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterModule, NzIconModule, NzMenuModule, FormsModule, NzSelectModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnDestroy {

  private subscriptions: Subscription = new Subscription();

  constructor(
    private lotteryService: LotteryService,
    private global: GlobalService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  lotteryData: Lottery[] = [];
  selectedLottery: Lottery | undefined;
  user: User | null = null;
  conected: boolean = false;

  ngOnInit() {
    // הירשמות לשינויים במצב החיבור
    this.subscriptions.add(
      this.global.connected$.subscribe(value => {
        this.conected = value;
        // אם התחלנו להיות מחוברים - נטען את המשתמש מהעוגיה (אם קיים)
        if (value) {
          const user = this.cookieService.get('user');
          if (user) {
            try { this.user = JSON.parse(user); } catch { this.user = null; }
          }
        } else {
          // אם נותקנו - ננקה
          this.user = null;
        }
      })
    );

    // טען לוטריות (כמו קודם)
    this.lotteryService.getAllLotteries().subscribe((data: Lottery[]) => {
      this.lotteryData = data;
      if (this.lotteryData.length) {
        this.selectedLottery = this.lotteryData[this.lotteryData.length - 1];
        this.global.currentLottery.set(this.selectedLottery);
      }
      // חשוב: לא צריך כאן לקרוא this.global.conected() — ההרשמה מטפלת בזה
    });
  }

  lotteryChange(value: Lottery): void {
    this.selectedLottery = value;
    this.global.currentLottery.set(this.selectedLottery);
  }

  logout(): void {
    this.cookieService.delete('auth_token');
    this.cookieService.delete('user');
    // הודעה ל־GlobalService שהחיבור שונה
    this.global.setConnected(false);
    // local state (יעודכן גם על ידי המנוי אבל נחזיר מיד)
    this.conected = this.global.isConnected();
    this.user = null;
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
