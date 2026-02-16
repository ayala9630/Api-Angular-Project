import { Component, effect, inject, SimpleChanges } from '@angular/core';
import { GiftService } from '../../../services/gift/gift.service';
import { GlobalService } from '../../../services/global/global.service';
import { GiftWithOldPurchase } from '../../../models/gift';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CardCarts, Category, PaginatedResult } from '../../../models';
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
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';


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
    public giftService: GiftService,
    public global: GlobalService,
    private cookieService: CookieService,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  paginatedGifts: PaginatedResult<GiftWithOldPurchase[]> | null = null;
  allGifts: GiftWithOldPurchase[] = [];
  allCategories: Category[] = [];
  admin: boolean = false;
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

  selectedCategory: number | null = null;

  private fb = inject(NonNullableFormBuilder)


  onSearchChange(searchValue: string): void {
    this.uploadData();
  }

  searchTypeChange(value: 'name' | 'donor'): void {
    console.log("searchTypeChange", value);
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
    this.uploadData()

  }

  edit(item: any): void {
    console.log("item", item);

    this.router.navigate([`/gifts/edit/${item}`]);
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
    this.giftService.getGifts(this.currentLotteryId, undefined, this.pageNumber, this.pageSize, this.searchText, this.searchType, this.sortType, this.ascendingOrder, this.selectedCategory).subscribe((gifts) => {
      this.paginatedGifts = gifts;
      this.allGifts = this.paginatedGifts.items.flat();
      this.categoryService.getAllCategories().subscribe((categories) => {
        this.allCategories = categories;
      });
    });
  }

  onPageChange(page: number): void {
    page = page || 1;
    this.pageNumber = page;
    this.uploadData();
  }

  onSortChange(type: 'name' | 'category' | 'price'): void {
    console.log("onSortChange", type);

    this.sortType = type;
    console.log("onSortChange", this.sortType);
    this.uploadData();
  }

  onSortOrderChange(ascending: boolean): void {
    console.log("onSortOrderChange", ascending);
    this.ascendingOrder = ascending;
    console.log("onSortOrderChange", this.ascendingOrder);
    this.uploadData();
  }

  private lotteryEffect = effect(() => {
    this.currentLotteryId = this.global.currentLotteryId();
    this.uploadData();
  });

  onCategoryChange(selectedCategory: number | null  ): void {
    this.selectedCategory = selectedCategory;
    this.uploadData();
  }

  

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }


  ngOnChanges(c: SimpleChanges): void {
    this.currentLotteryId = this.global.currentLotteryId();
    this.uploadData();
  }
}
