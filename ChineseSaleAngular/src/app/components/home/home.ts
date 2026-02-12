import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
