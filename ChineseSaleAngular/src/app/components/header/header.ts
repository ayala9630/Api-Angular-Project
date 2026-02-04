import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { LotteryService } from '../../services/lottery/lottery.service';
import { Lottery } from '../../models';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-header',
  imports: [NzIconModule, NzMenuModule,FormsModule, NzSelectModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

constructor(private lotteryService: LotteryService, private global: GlobalService) {}

  lotteryData: Lottery[] = [];
  selectedLottery:Lottery | undefined;

  ngOnInit() {
    this.lotteryService.getAllLotteries().subscribe((data: Lottery[]) => {
      this.lotteryData = data;
      this.selectedLottery = this.lotteryData[this.lotteryData.length -1];
      this.global.currentLottery.set(this.selectedLottery);
    });
  }
  
  lotteryChange(value: Lottery): void {
    this.selectedLottery = value;
    this.global.currentLottery.set(this.selectedLottery);
    console.log(this.global.currentLottery());
    console.log(this.global.currentLottery()?.id || 0);
    
  }
}
