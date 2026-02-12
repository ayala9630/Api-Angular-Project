import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { GiftService } from '../../../services/gift/gift.service';
import { GlobalService } from '../../../services/global/global.service';
import { CreateGift, Gift as GiftModel } from '../../../models/gift';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DonorService } from '../../../services/donor/donor.service';
import { Category, Donor } from '../../../models';
import { CategoryService } from '../../../services/category/category.service';
import { NzSelectModule } from 'ng-zorro-antd/select';


@Component({
  selector: 'app-add-gift',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzSelectModule,
    FormsModule
  ],
  templateUrl: './add-gift.html',
  styleUrls: ['./add-gift.scss'],
})
export class AddGift {

  constructor(
    private giftService: GiftService,
    private global: GlobalService,
    private router: Router,
    private donorService: DonorService,
    private categoryService: CategoryService
  ) { }


  private fb = inject(NonNullableFormBuilder)

  isConfirmLoading = false;
  currentLotteryId: number = 0;
  donorData: Donor[] = [];
  selectedDonor: Donor | undefined;
  categoryData: Category[] = [];
  selectedCategory: Category | undefined;



  validateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    giftValue: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    isPackageAble: [false],
    donorId: [0, [Validators.required]],
    categoryId: [0, [Validators.min(1)]],
    lotteryId: [this.currentLotteryId, [Validators.required]],
  });

  ngOnInit(): void {
    this.currentLotteryId = this.global.currentLotteryId();
    this.validateForm.patchValue({ lotteryId: this.currentLotteryId });
    this.donorService.getDonorByLotteryId(this.currentLotteryId).subscribe((donors: Donor[]) => {
      this.donorData = donors;
    });
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.categoryData = categories;
    });
  }

  submitForm(): void {
    console.log(this.validateForm.value);

    if (this.validateForm.valid) {
      this.isConfirmLoading = true;
      const giftData: CreateGift = {
        ...this.validateForm.value,
        lotteryId: this.currentLotteryId
      };

      this.giftService.createGift(giftData).subscribe({
        next: (newGift: GiftModel) => {
          console.log('Gift created successfully:', newGift);
          this.isConfirmLoading = false;
          this.router.navigate(['/gifts']);
        },
        error: (error) => {
          console.error('Error creating gift:', error);
          this.isConfirmLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/gifts']);
  }

  donorChange(value: number): void {
    this.validateForm.controls['donorId'].setValue(value || 0);
  }
  categoryChange(value: number): void {
    this.validateForm.controls['categoryId'].setValue(value || 0);
  }
}
