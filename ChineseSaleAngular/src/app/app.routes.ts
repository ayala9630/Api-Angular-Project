import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Gift } from './components/giftComponents/gift/gift';
import { Package } from './components/package/package';
import { Login } from './components/login/login';
import { SingleGift } from './components/giftComponents/single-gift/single-gift';
import { AddGift } from './components/giftComponents/add-gift/add-gift';
import { Home } from './components/home/home';


export const routes: Routes = [
        {path: 'register', component: Register},
        {path: 'login', component: Login},
        {path:'home', component: Home},
        {path: 'gifts', component: Gift},
        {path: 'gifts/gift/:id', component: SingleGift},
        {path:'gifts/add', component: AddGift},
        {path: 'packages', component: Package},
];