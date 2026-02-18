import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';
import { GiftService } from '../gift/gift.service';
import { PackageService } from '../package/package.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public availableCards: number = 0;
  totalPrice: number = 0;
  constructor(
    private packageService: PackageService,
    private giftService: GiftService,
  ) {
      this.initAvailableCards();    
  }

  initAvailableCards() {
    this.availableCards = 0;
    for (let i = 0; i < this.packageService.userCart().length; i++) {
      const numberOfCards = Number(this.packageService.userCart()[i].numberOfCards) || 0;
      console.log(numberOfCards);
      
      const quantity = Number(this.packageService.userCart()[i].quantity) || 0;
      console.log(quantity);
      
      this.availableCards += (numberOfCards * quantity);
    }
    for (let i = 0; i < this.giftService.userCart().length; i++) {
      if (this.giftService.userCart()[i].isPackageAble)
        this.availableCards -= (Number(this.giftService.userCart()[i].quantity) || 0);
    }
  }
}
