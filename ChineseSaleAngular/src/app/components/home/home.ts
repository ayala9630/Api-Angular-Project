import { AfterViewInit, Component, effect } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Router, RouterLink } from '@angular/router';
import { DonorService } from '../../services/donor/donor.service';
import { UserService } from '../../services/user/user.service';
import { GiftService } from '../../services/gift/gift.service';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-home',
  imports: [
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {

  constructor(
    private router: Router,
    private donorService: DonorService,
    private userService: UserService,
    private giftService: GiftService,
    private global: GlobalService

  ) { }


  numOfDonors = 0;
  numOfGifts = 0;
  numOfUsers = 0;
  daysToLottery = 0;

  private lotteryEffect = effect(() => {
    const endDate = this.global.currentLottery()?.endDate;
    const endTime = endDate ? new Date(endDate).getTime() : 0;
    this.daysToLottery = endTime - new Date().getTime();
    this.uploadData();
  });


  ngOnInit(): void {
    this.uploadData();
  }

  uploadData() {
    this.donorService.getDonorCountByLotteryId(this.global.currentLotteryId()).subscribe((count) => {
      this.numOfDonors = count;
    });
    this.giftService.getGiftCountByLotteryId(this.global.currentLotteryId()).subscribe((count) => {
      this.numOfGifts = count;
    });
    this.userService.getUserCount().subscribe((count) => {
      this.numOfUsers = count;
    });
  }

  animateValue(item: any, duration = 900) {
    const start = 0;
    const end = item.value;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = Math.min(now - startTime, duration);
      const progress = elapsed / duration;
      item.animatedValue = Math.round(progress * end);
      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        item.animatedValue = end;
      }
    };
    requestAnimationFrame(step);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  viewWinner(w: any) {
    // placeholder: navigate to donor or show modal
    this.router.navigate(['/donors']);
  }
}