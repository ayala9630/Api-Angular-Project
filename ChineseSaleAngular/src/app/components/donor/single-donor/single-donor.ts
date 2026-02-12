import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DonorService } from '../../../services/donor/donor.service';
import { GlobalService } from '../../../services/global/global.service';
import { SingleDonor as SingleDonorModel } from '../../../models/donor';
import { NzModalModule } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-single-donor',
  standalone: true,
  imports: [NzCardModule, NzListModule, NzDescriptionsModule, NzModalModule, NzGridModule, NzImageModule, NzSpaceModule, NzDividerModule, NzTypographyModule, NzPageHeaderModule, RouterOutlet],
  templateUrl: './single-donor.html',
  styleUrl: './single-donor.scss',
})
export class SingleDonor implements OnInit {
  currentDonor: SingleDonorModel | null = null;
  viewLoading = false;
  currentLotteryId = 0;
  viewDonor = true;
  constructor(
    
    private route :ActivatedRoute,
    private donorService :DonorService,
    private globalService :GlobalService,
    private msg :NzMessageService,
    private router :Router
  ) { }

  ngOnInit(): void {
    this.currentLotteryId = this.globalService.currentLotteryId();
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        this.router.navigate(['/donor']);
        return;
      }
      this.loadDonor(id);
    });
  }

  private loadDonor(id: number): void {
    this.viewLoading = true;
    this.currentDonor = null;
    this.donorService.getDonorById(id, this.currentLotteryId).subscribe({
      next: donor => {
        this.currentDonor = donor;
        this.viewLoading = false;
      },
      error: err => {
        console.error(err);
        this.msg.error('שגיאה בקבלת פרטי התורם');
        this.viewLoading = false;
        this.goBack();
      }
    });
  }

  giftEntries(): Array<{ name: string; count: number }> {
    if (!this.currentDonor?.gifts) return [];
    return Object.entries(this.currentDonor.gifts).map(([name, count]) => ({
      name,
      count: Number(count),
    }));
  }

  closeView(): void {
    this.viewDonor = false;
    this.currentDonor = null;
    this.viewLoading = false;
  }

  goBack(): void {
    this.router.navigate(['/donors']);
  }
}
