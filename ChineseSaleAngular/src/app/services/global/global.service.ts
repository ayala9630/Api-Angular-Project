import { Injectable } from '@angular/core';
import { Lottery } from '../../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private currentLottery = new BehaviorSubject<Lottery | null>(null);
  sharedData$ = this.currentLottery.asObservable();


  setCurrentLottery(data: Lottery | null) {
    this.currentLottery.next(data);
  }

}
