import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { GiftComponent } from './components/gift/gift';
// import { Gift2Component } from './components/gift2/gift2/gift2';
import { Container } from './components/container/container';
import { Package } from './components/packageComponents/package/package';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Package, Container,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('project01 - Copy');
}
