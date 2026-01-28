import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { Package } from '../package/package';
import { RouterOutlet } from '@angular/router';
import { Header } from "../header/header";

@Component({
  selector: 'app-container',
  imports: [RouterOutlet, NzLayoutModule, Package, Header],
  templateUrl: './container.html',
  styleUrl: './container.scss',
})
export class Container {

}
