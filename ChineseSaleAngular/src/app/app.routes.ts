import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Gift } from './components/giftComponents/gift/gift';
import { Package } from './components/packageComponents/package/package';
import { Login } from './components/login/login';
import { Donor } from './components/donor/donor';
import { SingleDonor } from './components/donor/single-donor/single-donor';
import { PostDonor } from './components/donor/post-donor/post-donor';
import { SingleGift } from './components/giftComponents/single-gift/single-gift';
import { AddGift } from './components/giftComponents/add-gift/add-gift';
import { Home } from './components/home/home';
import { single } from 'rxjs';
import { SinglePackage } from './components/packageComponents/single-package/single-package';
import { Purchase } from './components/purchasesComponent/purchase/purchase';
import { SingleGiftPurchases } from './components/purchasesComponent/single-gift-purchases/single-gift-purchases';
import { PostPackage } from './components/packageComponents/post-package/post-package';


export const routes: Routes = [
        {path: 'register', component: Register},
        {path: 'login', component: Login},
        {path:'home', component: Home},
        {path: 'gifts', component: Gift},
        {path: 'gifts/gift/:id', component: SingleGift},
        {path:'gifts/add', component: AddGift},
        {path:'gifts/edit/:id', component: AddGift},
        {path: 'packages', component: Package},
        {path:'packages/add', component: PostPackage},
        {path:'packages/edit/:id', component: PostPackage},
        {path: 'packages/package/:id', component: SinglePackage},
        {path:'donors', component: Donor},
        {path: 'donors/add',component: PostDonor},
        {path:'donors/edit/:id', component: PostDonor},
        {path:'donors/:id', component: SingleDonor},
        {path:'purchases', component: Purchase},
        {path:'purchases/purchase/:id', component: SingleGiftPurchases},

];