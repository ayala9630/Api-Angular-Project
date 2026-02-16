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
    public global: GlobalService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  lotteryData: Lottery[] = [];
  selectedLottery: Lottery | undefined;
  user: User | null = null;
  conected: boolean = false;
  admin: boolean = true;

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
      }});
  }

  lotteryChange(value: Lottery): void {
    this.selectedLottery = value;
    this.global.currentLottery.set(this.selectedLottery);
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
    this.global.setConnected(false);
    this.conected = this.global.isConnected();
    this.user = null;
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
