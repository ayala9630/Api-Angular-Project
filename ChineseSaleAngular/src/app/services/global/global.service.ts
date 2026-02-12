import { Injectable, signal, computed } from '@angular/core';
import { Lottery } from '../../models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  currentLottery = signal<Lottery | null>(null);
  currentLotteryId = computed(() => this.currentLottery()?.id || 0);
  lotteryStarted = computed(()=> (new Date(this.currentLottery()?.startDate || new Date())).getTime() <= new Date().getTime())
  lotteryFinished = computed(()=>(new Date(this.currentLottery()?.endDate|| new Date())).getTime() <= new Date().getTime())
}
