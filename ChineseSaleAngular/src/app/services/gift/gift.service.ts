import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardCart, CardCartGroup, CreateGift, Gift, GiftWithOldPurchase, PaginatedResult, UpdateGift } from '../../models';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})

export class GiftService {
  private readonly url = `${environment.apiUrl}/gift`;
  private readonly cart = signal<CardCartGroup[]>([]);
  public readonly userId = signal<number | null>(null);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private global: GlobalService
  ) {
    this.cart.set(this.readCartFromCookie());
    this.userId.set(this.getUserId());
    // this.userFromCookie();
  }

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
    if (categoryId !== undefined && categoryId !== null) queryParams += `&categoryId=${categoryId}`;
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
  userCart = computed(() => {
    const userId = this.userId();
    if (!userId) return [];
    const userCartGroup = this.cart().find(group => group.userId === userId);
    return userCartGroup ? userCartGroup.userCart : [];
  });

  // userFromCookie(): void {
  //   this.userId.set(this.getUserId());
  // }

  readCartFromCookie(): CardCartGroup[] {
    const raw = this.cookieService.get('cardCart');
    return raw ? JSON.parse(raw) : [];
  }

  writeCartToCookie(cart: CardCartGroup[]): void {
    this.cookieService.set('cardCart', JSON.stringify(cart));
  }

  getUserId(): number | null {
    const user = this.cookieService.get('user');
    if (!user) return null;
    try {
      return JSON.parse(user).id ?? null;
    } catch {
      return null;
    }
  }

  updateCardQuantity(card: CardCart, qty: number): void {
    // if (!gift) return;
    // console.log((gift as CardCart).giftId ?? (gift as GiftWithOldPurchase).id + " gift as GiftWithOldPurchase " + (gift as GiftWithOldPurchase).name + " gift as CardCart " + (gift as CardCart).giftName);
    const userId = this.userId();
    if (!userId) {
      return;
    }
    const updatedCart = [...this.cart()];
    let userGroup = updatedCart.find(item => item.userId === userId);
    if (!userGroup) {
      if (qty <= 0) {
        return;
      }
      userGroup = { userId, userCart: [] };
      updatedCart.push(userGroup);
    }

    const existingItem = userGroup.userCart.find(item => item.giftId === card.giftId);
    if (existingItem) {
      existingItem.quantity += qty;
      if (existingItem.quantity <= 0) {
        userGroup.userCart = userGroup.userCart.filter(item => item.giftId !== card.giftId);
      }
    } else if (qty > 0) {
      userGroup.userCart.push({ ...card, quantity: qty });
    }

    if (userGroup.userCart.length === 0) {
      const filteredCart = updatedCart.filter(item => item.userId !== userId);
      this.cart.set(filteredCart);
      this.writeCartToCookie(filteredCart);
      return;
    }

    this.cart.set(updatedCart);
    this.writeCartToCookie(updatedCart);
  }

  getGiftQuantity(giftId: number): number {
    const userId = this.userId();
    if (!userId) return 0;
    const userCartGroup = this.cart().find(item => item.userId === userId);
    if (!userCartGroup) return 0;
    const cartItem = userCartGroup.userCart.find(item => item.giftId === giftId);
    return cartItem ? cartItem.quantity : 0;
  }
}