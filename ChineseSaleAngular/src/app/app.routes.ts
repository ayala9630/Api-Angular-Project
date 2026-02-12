import { Routes } from '@angular/router';
import { Container } from './components/container/container';
import { Register } from './components/register/register';
import { Gift } from './components/gift/gift';
import { Package } from './components/package/package';
import { Login } from './components/login/login';
import { Donor } from './components/donor/donor';
import { SingleDonor } from './components/donor/single-donor/single-donor';
import { PostDonor } from './components/donor/post-donor/post-donor';


export const routes: Routes = [
        {path: 'register', component: Register},
        {path: 'login', component: Login},
        {path: 'gifts', component: Gift},
        {path: 'packages', component: Package},
        {path:'donors', component: Donor},
        {path: 'donors/add',component: PostDonor},
        {path:'donors/edit/:id', component: PostDonor},
        {path:'donors/:id', component: SingleDonor},
];