import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Gift } from './components/gift/gift';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Gift],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('project01 - Copy');
}
