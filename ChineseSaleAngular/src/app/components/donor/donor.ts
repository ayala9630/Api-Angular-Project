import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { DonorService } from '../../services/donor/donor.service';
import { GlobalService } from '../../services/global/global.service';
import { Donor as DonorModel, SingleDonor } from '../../models/donor';
import { PaginatedResult } from '../../models';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconDirective } from "ng-zorro-antd/icon";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
const count = 5;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

@Component({
  selector: 'app-donor',
  imports: [
    FormsModule,
    NzButtonModule,
    NzListModule,
    NzSkeletonModule,
    NzPaginationModule,
    NzModalModule,
    NzCardModule,
    NzDescriptionsModule,
    NzSelectModule,
    NzIconDirective,
    RouterModule
  ],
  templateUrl: './donor.html',
  styleUrl: './donor.scss',
})
export class Donor {
  initLoading = false; // bug
  loadingMore = false;
  data: PaginatedResult<DonorModel> = null as any;
  list: Array<{ loading: boolean; name: any }> = [];
  allDonors: DonorModel[] = [];
  allDonorsForAdd: DonorModel[] = [];
  currentLotteryId: number = 0;
  pageNumber: number = 1;
  pageSize: number = 2;
  currentDonor: SingleDonor | null = null;
  viewDonor: boolean = false;
  viewLoading: boolean = false;
  addModalVisible = false;
  selectedDonorId: number | null = null;

  msg: NzMessageService = inject(NzMessageService);
  constructor(
    private donorService: DonorService,
    private globalService: GlobalService,
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.currentLotteryId = this.globalService.currentLotteryId();
    this.pageNumber = 1;
    this.uploadData(this.pageNumber);

    this.route.queryParams.subscribe(params => {
      if (params['reopenAddModal'] === 'true') {
        this.getAllDonorsForAdd();
        this.selectedDonorId = null;
        this.addModalVisible = true;
      }
    });
  }

  uploadData(page: number): void {
    this.donorService.getDonorsWithPagination(this.currentLotteryId, page, this.pageSize).subscribe((donors) => {
      this.data = donors;
      this.allDonors = this.data.items;
      this.pageNumber = page;
      this.loadingMore = false;
    });
  }
  getAllDonorsForAdd(): void {
    this.donorService.getAllDonors().subscribe((donors) => {
      this.allDonorsForAdd = donors;
    });
  }

  onLoadMore(page: number): void {
    this.loadingMore = true;
    this.uploadData(page);
  }

  onPageChange(page: number): void {
    this.uploadData(page);
  }

  edit(item: any): void {
    this.msg.success(item.email);
  }

  delete(id: number): void {
    this.modal.confirm({
      nzTitle: 'אישור מחיקה',
      nzContent: 'האם אתה בטוח שברצונך למחוק את התורם?',
      nzOkText: 'כן, מחק',
      nzCancelText: 'ביטול',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.donorService.deleteDonor(id, this.currentLotteryId).subscribe({
          next: () => {
            this.uploadData(this.pageNumber);
            this.msg.success('תורם נמחק בהצלחה');
          },
          error: (error) => {
            console.error('Error deleting donor:', error);
            this.msg.error('שגיאה במחיקת תורם');
          }
        });
      },
      nzOnCancel: () => {
        console.log('Delete cancelled');
      }
    });
  }

  view(id: number): void {
    this.viewDonor = true;
    this.viewLoading = true;
    this.currentDonor = null;
    this.donorService.getDonorById(id, this.currentLotteryId).subscribe({
      next: (donor) => {
        this.currentDonor = donor;
        console.log(donor);
        this.viewLoading = false;
      },
      error: (error) => {
        console.error('Error fetching donor details:', error);
        this.msg.error('שגיאה בקבלת פרטי התורם');
        this.viewLoading = false;
      }
    });
  }

  closeView(): void {
    this.viewDonor = false;
    this.currentDonor = null;
    this.viewLoading = false;
  }

  giftEntries(): Array<{ name: string; count: number }> {
    if (!this.currentDonor?.gifts) return [];
    return Object.entries(this.currentDonor.gifts).map(([name, count]) => ({
      name,
      count: Number(count),
    }));
  }

  add(): void {
    this.getAllDonorsForAdd();
    console.log(this.allDonorsForAdd);
    
    this.selectedDonorId = null;
    this.addModalVisible = true;
  }

  closeAddModal(): void {
    this.addModalVisible = false;
  }

  confirmAddDonor(): void {
    if (!this.selectedDonorId) return;
    this.donorService.addLotteryToDonor(this.selectedDonorId, this.currentLotteryId).subscribe({
      next: () => {
        this.addModalVisible = false;
        this.msg.success('התורם נוסף להגרלה');
        this.uploadData(this.pageNumber);
      },
      error: (error) => {
        console.error('Error adding donor to lottery:', error);
        this.msg.error('שגיאה בהוספת התורם להגרלה');
      }
    });
  }

  goToAddDonor(): void {
    this.addModalVisible = false;
    this.router.navigate(['/donors/add']);
  }
}
