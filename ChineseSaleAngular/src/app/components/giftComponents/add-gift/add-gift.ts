import { Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { GiftService } from '../../../services/gift/gift.service';
import { GlobalService } from '../../../services/global/global.service';
import { CreateGift, Gift as GiftModel, UpdateGift } from '../../../models/gift';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DonorService } from '../../../services/donor/donor.service';
import { Category, Donor } from '../../../models';
import { CategoryService } from '../../../services/category/category.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';


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
    private msg: NzMessageService,
    private giftService: GiftService,
    private global: GlobalService,
    private router: Router,
    private donorService: DonorService,
    private categoryService: CategoryService,
    private activateRoute: ActivatedRoute
  ) { }


  private fb = inject(NonNullableFormBuilder)

  isConfirmLoading = false;
  currentLotteryId: number = 0;
  donorData: Donor[] = [];
  selectedDonor: Donor | undefined;
  categoryData: Category[] = [];
  selectedCategory: Category | undefined;
  id: number | null = null;
  editing: boolean = false;


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
    this.activateRoute.params.subscribe(params => this.id = params['id']);
    console.log("this.id", this.id);
    if (this.id) {
      this.editing = true;
      this.giftService.getGiftForUpdate(this.id).subscribe({
        next: (gift) => {
          this.validateForm.patchValue({
            name: gift.name,
            description: gift.description,
            price: gift.price,
            giftValue: gift.giftValue,
            imageUrl: gift.imageUrl,
            isPackageAble: gift.isPackageAble,
            donorId: gift.donorId,
            categoryId: gift.categoryId,
            lotteryId: gift.lotteryId,
          });
          this.selectedDonor =this.validateForm.controls['donorId'].value;
          this.selectedCategory = this.validateForm.controls['categoryId'].value;
        },
        error: (error) => {
          this.msg.error('מתנה לא קיימת')
          this.router.navigateByUrl('gifts')
        }
      })
    }
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
    console.log("submit form");
    console.log("id:", this.id);
    console.log("editing:", this.editing);




    // console.log(this.validateForm.value);
    if (!this.editing) {
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
    } else {
      const updatePayload: UpdateGift = {
        ...(this.validateForm.value as UpdateGift),
      };
      updatePayload.id = this.id!;

      this.giftService.UpdateGift(updatePayload).subscribe({
        next: () => {
          console.log('פרטי המתנה התעדכנו בהצלחה');
          this.msg.success('פרטי המתנה התעדכנו בהצלחה');
          this.router.navigateByUrl('/gifts');
        },
        error: () => {
          console.error('שגיאה בעדכון המתנה');
          this.msg.error('שגיאה בעדכון המתנה');
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
