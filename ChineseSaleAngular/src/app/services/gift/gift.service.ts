import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardCart, CreateGift, Gift, GiftWithOldPurchase, PaginatedResult, UpdateGift } from '../../models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class GiftService {
  private readonly url = `${environment.apiUrl}/gift`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  getGifts(
    lotteryId: number,
    userId?: number,
    pageNumber?: number,
    pageSize?: number,
    searchText?: string,
    searchType?: 'name' | 'donor',
    sortType?: 'name' | 'category' | 'price',
    ascendingOrder?: boolean,
    categoryId?: number | null
  ): Observable<PaginatedResult<GiftWithOldPurchase[]>> {
    let queryParams = `?lotteryId=${lotteryId}`;
    if (userId !== undefined) queryParams += `&userId=${userId}`;
    if (pageNumber !== undefined && pageSize !== undefined)
      queryParams += `&pageNumber=${pageNumber} + &pageSize=${pageSize}`;
    if (searchText !== undefined && searchType !== undefined) {
      if (searchType === 'name') queryParams += `&name=${searchText}`;
      else if (searchType === 'donor') queryParams += `&donor=${searchText}`;
    }
    if (sortType !== undefined && ascendingOrder !== undefined)
      queryParams += `&sortType=${sortType}&ascendingOrder=${ascendingOrder}`;
    if (categoryId !== null) queryParams += `&categoryId=${categoryId}`;
    console.log(queryParams);

    return this.http.get<PaginatedResult<GiftWithOldPurchase[]>>(`${this.url}/lottery/${lotteryId}/search-pagination/${queryParams}`);
  }

  getGiftById(id: number): Observable<Gift> {
    return this.http.get<Gift>(`${this.url}/${id}`);
  }

  getGiftCountByLotteryId(lotteryId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/lottery/${lotteryId}/count`);
  }

  getGiftForUpdate(id: number): Observable<UpdateGift> {
    return this.http.get<UpdateGift>(`${this.url}/id/${id}/update`);
  }

  createGift(gift: CreateGift): Observable<Gift> {
    return this.http.post<Gift>(`${this.url}`, gift);
  }

  UpdateGift(gift: UpdateGift): Observable<Gift> {
    return this.http.put<Gift>(`${this.url}`, gift);
  }

  deleteGift(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  //Additional functions

  cart: CardCart[] = [];

  ngOnInit(): void {
    this.cart = this.cookieService.get('cardCartUser1') ? JSON.parse(this.cookieService.get('cardCartUser1')!) : [];
  }
  
  updateQuantity(gift: GiftWithOldPurchase | CardCart |undefined | Gift, qty: number): void {
    if (!gift) return;
    console.log((gift as CardCart).giftId ??(gift as GiftWithOldPurchase).id+ " gift as GiftWithOldPurchase " + (gift as GiftWithOldPurchase).name + " gift as CardCart " + (gift as CardCart).giftName);
    
    const existingCartItem = this.cart.find(item => item.giftId === ((gift as CardCart).giftId ?? (gift as GiftWithOldPurchase).id));
    if (existingCartItem) {
      existingCartItem.quantity += qty;
      if (existingCartItem.quantity <= 0) {
        this.cart = this.cart.filter(item => item.giftId !== ((gift as CardCart).giftId ?? (gift as GiftWithOldPurchase).id));
      }
    } else if (qty > 0) {
      this.cart.push({ giftId: (gift as CardCart).giftId ??(gift as GiftWithOldPurchase).id, quantity: qty ,giftName: (gift as GiftWithOldPurchase).name ?? (gift as CardCart).giftName, imageUrl: gift?.imageUrl ?? '', price: gift?.price ?? 0, isPackageAble: gift?.isPackageAble ?? true, userId: Number(this.cookieService.get('userId')) || 0, id: 0 });
    }
    this.cookieService.set('cardCartUser1', JSON.stringify(this.cart), 7);
  }

  getGiftQuantity(giftId: number): number {
    const cartItem = this.cart.find(item => item.giftId === giftId);
    return cartItem ? cartItem.quantity : 0;
  }
}