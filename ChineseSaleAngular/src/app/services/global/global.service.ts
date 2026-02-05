import { computed, Injectable, signal } from '@angular/core';
import { Lottery } from '../../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class GlobalService {
  currentLottery = signal<Lottery | null>(null);
  currentLotteryId = computed(() => this.currentLottery()?.id || 0);


  setCookie(name: string, value: string, days: number): void {
    const expires: string = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }

  getCookie(name: string): string | null {
    return document.cookie.split('; ').reduce((acc: string | null, cookie: string) => {
      const [key, value] = cookie.split('=');
      return key === name ? decodeURIComponent(value) : acc;
    }, null);
  }

  deleteCookie(name: string): void {
    this.setCookie(name, '', -1); 
  }

}

