import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
// import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';
import { LotteryService } from '../../../services/lottery/lottery.service';
import { GlobalService } from '../../../services/global/global.service';
import { environment } from '../../../enviroment';
import { GiftService } from '../../../services/gift/gift.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-lotttery',
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzPaginationModule,
    NzResultModule,
    NzSpinModule,
    NzBadgeModule,
    NzTagModule,
    // NzToolTipModule
  ],
  templateUrl: './lotttery.html',
  styleUrls: ['./lotttery.scss'],
})
export class Lotttery implements OnInit, OnDestroy {
  constructor(
    private lotteryService: LotteryService,
    public global: GlobalService,
    private giftService: GiftService
  ) {}

  environment = environment;
  allGifts: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 6;
  total: number = 0;
  isExporting: boolean = false;

  // Modal & countdown state
  selectedGift: any = null;
  showConfirmModal: boolean = false;
  showCountdownModal: boolean = false;
  showWinnerModal: boolean = false;
  countdownValue: number = 5;
  isDrawing: boolean = false;
  winnerName: string = '';
  private countdownTimer: any = null;

  // Can the lottery be performed?
  get canDraw(): boolean {
    return !!this.global.lotteryStarted() && !this.global.lotteryFinished();
  }

  ngOnInit(): void {
    this.loadGifts();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }
  private lotteryEffect = effect(() => {
    this.loadGifts();
  });
  
  loadGifts(): void {
    const lotteryId = this.global.currentLotteryId();
    if (!lotteryId) return;

    this.giftService.getGifts(lotteryId, this.pageNumber, this.pageSize).subscribe({
      next: (res: any) => {
        this.allGifts = res.items ?? res;
        this.total = res.totalCount ?? this.allGifts.length;
      },
      error: () => {
        this.global.msg.error('שגיאה בטעינת המתנות');
      }
    });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadGifts();
  }

  // Step 1: User clicks a gift card
  onGiftClick(gift: any): void {
    if (!this.canDraw) return;
    if (gift.winner && gift.winner.trim() !== '') return; // already drawn
    if (gift.countCards === 0) return; // no tickets

    this.selectedGift = gift;
    this.showConfirmModal = true;
  }

  // Step 2: User confirms — start countdown
  onConfirmDraw(): void {
    this.showConfirmModal = false;
    this.showCountdownModal = true;
    this.countdownValue = 5;

    this.countdownTimer = setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue <= 0) {
        this.clearCountdown();
        this.executeDraw();
      }
    }, 1000);
  }

  onCancelDraw(): void {
    this.showConfirmModal = false;
    this.selectedGift = null;
  }

  // Step 3: Call the API
  private executeDraw(): void {
    this.isDrawing = true;

    this.lotteryService.lottery(this.selectedGift.id).subscribe({
      next: (result: any) => {
        this.isDrawing = false;
        this.showCountdownModal = false;
        this.winnerName = result?.winnerName ?? result?.winner ?? result ?? 'לא ידוע';
        this.showWinnerModal = true;

        // Update the gift in the local array
        const idx = this.allGifts.findIndex(g => g.id === this.selectedGift.id);
        if (idx !== -1) {
          this.allGifts[idx].winner = this.winnerName;
        }
      },
      error: () => {
        this.isDrawing = false;
        this.showCountdownModal = false;
        this.global.msg.error('שגיאה בביצוע ההגרלה');
      }
    });
  }

  closeWinnerModal(): void {
    this.showWinnerModal = false;
    this.selectedGift = null;
    this.winnerName = '';
  }

  private clearCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  // Helper: get gift status
  getGiftStatus(gift: any): 'won' | 'ready' | 'no-tickets' | 'disabled' {
    if (gift.winner && gift.winner.trim() !== '') return 'won';
    if (!this.canDraw) return 'disabled';
    if (gift.countCards === 0) return 'no-tickets';
    return 'ready';
  }

  exportSummary(format: 'csv' | 'json' | 'pdf'): void {
    const lotteryId = this.global.currentLotteryId();
    if (!lotteryId) {
      this.global.msg.warning('לא נבחרה הגרלה');
      return;
    }

    this.isExporting = true;

    this.lotteryService.exportLotteryReport(lotteryId, format).subscribe({
      next: (response: HttpResponse<Blob>) => {
        this.isExporting = false;
        const blob = response.body;

        if (!blob) {
          this.global.msg.error('התקבלה תגובה ריקה מהשרת');
          return;
        }

        // --- NEW LOGIC ---
        if (format === 'pdf') {
          // For PDF, open the HTML report in a new tab
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          // No need to revoke, the new tab holds the reference
          this.global.msg.info('דוח ההגרלה נפתח בכרטיסייה חדשה');

        } else {
          // For CSV/JSON, download the file directly
          const contentDisposition = response.headers.get('content-disposition');
          let fileName = `lottery-report-${lotteryId}.${format}`; // Fallback
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch && fileNameMatch.length > 1) {
              fileName = fileNameMatch[1];
            }
          }

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.global.msg.success('הקובץ הורד בהצלחה');
        }
      },
      error: (err) => {
        this.isExporting = false;
        if (err.status === 404) {
          this.global.msg.warning('לא נמצאו נתונים לייצוא');
        } else {
          this.global.msg.error('שגיאה בייצוא סיכום ההגרלה');
        }
      }
    });
  }
}