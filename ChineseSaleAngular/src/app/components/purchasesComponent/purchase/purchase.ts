import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzListComponent, NzListItemComponent, NzListItemMetaComponent, NzListItemMetaTitleComponent, NzListItemMetaDescriptionComponent } from "ng-zorro-antd/list";
import { RouterLink } from "@angular/router";
import { CardService } from '../../../services/card/card.service';
import { ListCard, PaginatedResult } from '../../../models';
import { GlobalService } from '../../../services/global/global.service';
import { NzNoAnimationDirective } from "ng-zorro-antd/core/animation";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzOptionComponent } from "ng-zorro-antd/select";
import { NzSwitchComponent } from "ng-zorro-antd/switch";
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from "ng-zorro-antd/select";



@Component({
  selector: 'app-purchase',
  imports: [NzPaginationModule,
    NzListComponent,
    NzListItemComponent,
    NzListItemMetaComponent,
    NzListItemMetaTitleComponent,
    RouterLink,
    FormsModule,
    NzNoAnimationDirective,
    NzListItemMetaDescriptionComponent,
    NzButtonModule,
    NzOptionComponent,
    NzSelectModule,
    NzInputModule,
    NzPaginationModule,
    NzSwitchComponent],
  templateUrl: './purchase.html',
  styleUrl: './purchase.scss',
})
export class Purchase {
  constructor(
    private cardService: CardService,
    public global: GlobalService
  ) { }

  allGifts: ListCard[] = [];
  data: PaginatedResult<ListCard> | null = null;
  sortType: 'value' | 'purchases' = 'value';
  ascending: boolean = true;
  pageNumber: number = 1;
  pageSize: number = 10;
  initLoading = false;


  ngOnInit() {
    this.uploadData();
  }

  uploadData() {
    this.cardService.getCardsWithPaginationSorted(this.global.currentLotteryId(), this.pageNumber, this.pageSize, this.sortType, this.ascending).subscribe((res) => {
      this.allGifts = res.items;
      this.data = res;
      console.log(res);
    })
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.uploadData();
  }
  onSortChange(type: 'value' | 'purchases'): void {
    this.sortType = type;
    this.uploadData();
  }

  onSortOrderChange(ascending: boolean): void {
    this.ascending = ascending;
    this.uploadData();
  }


  private lotteryEffect = effect(() => {
    this.uploadData();
  });


}
