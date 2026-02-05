import { Routes } from '@angular/router';
import { Container } from './components/container/container';
import { Register } from './components/register/register';
import { Gift } from './components/gift/gift';
import { Package } from './components/package/package';
import { Login } from './components/login/login';


export const routes: Routes = [
        {path: 'register', component: Register},
        {path: 'login', component: Login},
        {path: 'gifts', component: Gift},
        {path: 'packages', component: Package},


];