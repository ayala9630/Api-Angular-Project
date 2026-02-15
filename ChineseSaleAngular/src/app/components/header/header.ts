import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { LotteryService } from '../../services/lottery/lottery.service';
import { Lottery, User } from '../../models';
import { GlobalService } from '../../services/global/global.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, NzIconModule, NzMenuModule, FormsModule, NzSelectModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(
    private lotteryService: LotteryService,
    private global: GlobalService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  lotteryData: Lottery[] = [];
  selectedLottery: Lottery | undefined;
  user: User | null = null;
  admin: boolean = true;

  ngOnInit() {
    console.log("header-init");
    this.lotteryService.getAllLotteries().subscribe((data: Lottery[]) => {
      this.lotteryData = data;
      this.selectedLottery = this.lotteryData[this.lotteryData.length - 1];
      this.global.currentLottery.set(this.selectedLottery);
      const user = this.cookieService.get('user');
      if (user) {
        this.user = JSON.parse(user);
        // this.admin = this.user?.isAdmin || false;
      }
    });
  }

  lotteryChange(value: Lottery): void {
    this.selectedLottery = value;
    this.global.currentLottery.set(this.selectedLottery);
    console.log(this.global.currentLottery());
    console.log(this.global.currentLottery()?.id || 0);

  }
  logout(): void {
    this.cookieService.delete('auth_token');
    this.cookieService.delete('user');
    this.user = null;
    this.router.navigate(['/login']);
  }
}
