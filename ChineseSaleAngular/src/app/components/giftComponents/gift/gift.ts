import { Component, effect, inject, SimpleChanges } from '@angular/core';
import { GiftService } from '../../../services/gift/gift.service';
import { GlobalService } from '../../../services/global/global.service';
import { GiftWithOldPurchase } from '../../../models/gift';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CardCarts, PaginatedResult } from '../../../models';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzOptionComponent } from "ng-zorro-antd/select";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSwitchComponent } from "ng-zorro-antd/switch";

@Component({
  selector: 'app-gift',
  imports: [
    NzAvatarModule,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NzTransferModule,
    NzSelectModule,
    RouterLink,
    FormsModule,
    NzInputModule,
    CommonModule,
    ReactiveFormsModule,
    NzOptionComponent,
    NzPaginationModule,
    NzSwitchComponent
  ],
  templateUrl: './gift.html',
  styleUrl: './gift.scss',
})


export class Gift {
  constructor(
    private giftService: GiftService,
    public global: GlobalService,
    private cookieService: CookieService
  ) { }

  paginatedGifts: PaginatedResult<GiftWithOldPurchase[]> | null = null;
  allGifts: GiftWithOldPurchase[] = [];
  admin: boolean = true;
  currentLotteryId: number = 0;
  cart: CardCarts[] = [];
  isVisible: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 3;

  searchText: string = '';
  filteredGifts: GiftWithOldPurchase[] = [];
  searchType: 'name' | 'donor' = 'name';
  placeholderText: 'חפש מתנה...' | 'חפש תורם...' = 'חפש מתנה...';
  sortType: 'price' | 'category' | 'name' = 'price';
  ascendingOrder: boolean = true;

  private fb = inject(NonNullableFormBuilder)


  onSearchChange(searchValue: string): void {
    // console.log("onSearchChange");
    this.uploadData();
    // console.log(this.searchText);
  }

  searchTypeChange(value: 'name' | 'donor'): void {
    this.searchType = value;
    this.onSearchChange(this.searchText);
    if (value === 'name') {
      this.placeholderText = 'חפש מתנה...';
    } else {
      this.placeholderText = 'חפש תורם...';
    }
  }

  ngOnInit(): void {
    this.currentLotteryId = this.global.currentLotteryId();
    const token = this.cookieService.get('authToken') || '';
    // const userId = getClaim(token, 'sub') || getClaim(token, 'userId');
    // this.cookieService.set('cardCart', [], 7);
    this.cart = this.cookieService.get('cardCartUser1') ? JSON.parse(this.cookieService.get('cardCartUser1')!) : [];
    this.uploadData()

  }


  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    giftValue: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    isPackageAble: [false],
    donorId: [0, [Validators.required, Validators.min(1)]],
    categoryId: [0, [Validators.min(1)]],
    lotteryId: [this.currentLotteryId, [Validators.required]],
  });


  uploadData(): void {
    this.giftService.getGifts(this.currentLotteryId, undefined, this.pageNumber, this.pageSize, this.searchText, this.searchType, this.sortType, this.ascendingOrder).subscribe((gifts) => {
      this.paginatedGifts = gifts;
      this.allGifts = this.paginatedGifts.items.flat();
    });
  }

  onPageChange(page: number): void {
    page = page || 1;
    this.pageNumber = page;
    this.uploadData();
  }

  onSortChange(type: 'name' | 'category' | 'price'): void {
    this.sortType = type;
    this.uploadData();
  }

  onSortOrderChange(ascending: boolean): void {
    this.ascendingOrder = ascending;
    this.uploadData();
  }

  edit() {
    this.validateForm.patchValue({
      name: this.validateForm.value.name,
      description: this.validateForm.value.description,
      price: this.validateForm.value.price,
      giftValue: this.validateForm.value.giftValue,
      imageUrl: this.validateForm.value.imageUrl,
      isPackageAble: this.validateForm.value.isPackageAble,
      donorId: this.validateForm.value.donorId,
      categoryId: this.validateForm.value.categoryId,
      lotteryId: this.currentLotteryId,
    });

  }

  private lotteryEffect = effect(() => {
    this.currentLotteryId = this.global.currentLotteryId();
    this.uploadData();
    // if (this.global.currentLottery() != null) {
    // this.lotteryfinished = (new Date(this.global.currentLottery()?.endDate|| new Date()).getTime() <= new Date().getTime());
    // this.lotteryStarted = (new Date(this.global.currentLottery()?.startDate|| new Date()).getTime() <= new Date().getTime());
    // }    
    // console.log("started", this.global.lotteryStarted(), "finished", this.global.lotteryFinished());  
  });


  updateGift(giftId: number, qty: number): void {
    const existingCartItem = this.cart.find(item => item.giftId === giftId);
    if (existingCartItem) {
      existingCartItem.quantity += qty;
      if (existingCartItem.quantity <= 0) {
        this.cart = this.cart.filter(item => item.giftId !== giftId);
      }
    } else if (qty > 0) {
      this.cart.push({ giftId: giftId, quantity: qty });
    }
    this.cookieService.set('cardCartUser1', JSON.stringify(this.cart), 7);
  }

  getGiftQuantity(giftId: number): number {
    const cartItem = this.cart.find(item => item.giftId === giftId);
    return cartItem ? cartItem.quantity : 0;
  }

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }


  ngOnChanges(c: SimpleChanges): void {
    this.currentLotteryId = this.global.currentLotteryId();
    this.uploadData();

    // this.validateForm = new FormGroup({
    //   name: this.fb.group(['', [Validators.required]]),
    //   description:this.fb.group( ['']),
    //   price: this.fb.group([0, [Validators.required, Validators.min(0)]]),
    //   giftValue: this.fb.group([0, [Validators.required, Validators.min(0)]]),
    //   imageUrl: this.fb.group(['']),
    //   isPackageAble: this.fb.group([false]),
    //   donorId: this.fb.group([0, [Validators.required, Validators.min(1)]]),
    //   categoryId: this.fb.group([0, [Validators.min(1)]]),
    //   lotteryId: this.fb.group([this.currentLotteryId, [Validators.required]]),
    // });
  }





}
