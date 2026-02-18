import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Package, CreatePackage, UpdatePackage, PackageCarts, CardCartGroup, PackageCart, PackageCartGroup } from '../../models';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../global/global.service';
import { CartService } from '../cart/cart.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private readonly url = `${environment.apiUrl}/package`;
  private readonly cart = signal<PackageCartGroup[]>([]);
  public readonly userId = signal<number | null>(null);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private global: GlobalService,
  ) {
    this.cart.set(this.readCartFromCookie());
    this.userId.set(this.getUserId());
   }

  getPackageById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.url}/${id}`);
  }
  getPackageForUpdate(id: number): Observable<UpdatePackage> {
    return this.http.get<UpdatePackage>(`${this.url}/id/${id}/update`);
  }

  getPackagesByLotteryId(lotteryId: number): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.url}/lottery/${lotteryId}`);
  }

  addPackage(packageData: CreatePackage): Observable<number> {
    return this.http.post<number>(this.url, packageData);
  }

  updatePackage(packageData: UpdatePackage): Observable<void> {
    return this.http.put<void>(this.url, packageData);
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(this.url, {
      params: { id }
    });
  }
  //Aditional functions

  userCart = computed(() => {
    const userId = this.userId();
    if (!userId) return [];
    const userCartGroup = this.cart().find(group => group.userId === userId);
    return userCartGroup ? userCartGroup.userCart : [];
  });

  readCartFromCookie(): PackageCartGroup[] {
    const raw = this.cookieService.get('packageCart');
    return raw ? JSON.parse(raw) : [];
  }

  writeCartToCookie(cart: PackageCartGroup[]): void {
    this.cookieService.set('packageCart', JSON.stringify(cart));
  }

  getUserId(): number | null {
    const user = this.cookieService.get('user');
    if (!user) return null; 
    try {
      return JSON.parse(user).id ?? null;
    }
    catch {
      return null;
    }
  }
  updatePackageQuantity(card: PackageCart, qty: number): void {
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
      const existingItem = userGroup.userCart.find(item => item.packageId === card.packageId);
      if (existingItem) {
        existingItem.quantity += qty;
        if (existingItem.quantity <= 0) {
          userGroup.userCart = userGroup.userCart.filter(item => item.packageId !== card.packageId);
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
  
    getPackageQuantity(packageId: number): number {
      const userId = this.userId();
      if (!userId) return 0;
      const userCartGroup = this.cart().find(item => item.userId === userId);
      if (!userCartGroup) return 0;
      const cartItem = userCartGroup.userCart.find(item => item.packageId === packageId);
      return cartItem ? cartItem.quantity : 0;
    }
  

}