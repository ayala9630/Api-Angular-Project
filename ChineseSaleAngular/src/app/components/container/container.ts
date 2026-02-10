import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { Package } from '../package/package';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Gift } from '../gift/gift';
import { Register } from "../register/register";
import { Login } from "../login/login";
import { Donor } from '../donor/donor';

@Component({
  selector: 'app-container',
  imports: [RouterOutlet, NzLayoutModule, Package, Header, Gift, Register, Login,Donor],
  templateUrl: './container.html',
  styleUrl: './container.scss',
})
export class Container {

}
