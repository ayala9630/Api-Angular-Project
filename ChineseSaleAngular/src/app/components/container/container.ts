import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Cart } from "../cart/cart";


@Component({
  selector: 'app-container',
  imports: [RouterOutlet, NzLayoutModule, Header, Cart],
  templateUrl: './container.html',
  styleUrl: './container.scss',
})
export class Container {
  
}
