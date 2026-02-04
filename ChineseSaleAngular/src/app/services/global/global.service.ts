import { Injectable, signal, computed } from '@angular/core';
import { Lottery } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  currentLottery = signal<Lottery | null>(null);
  currentLotteryId = computed(() => this.currentLottery()?.id || 0);

}
