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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FilesService } from '../../../services/files/files.sevice';

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
    FormsModule,
    NzIconModule,
    NzUploadModule,
    NzButtonModule,
  ],
  templateUrl: './add-gift.html',
  styleUrls: ['./add-gift.scss'],
})
export class AddGift {
  private fb = inject(NonNullableFormBuilder);

  isConfirmLoading = false;
  currentLotteryId: number = 0;
  donorData: Donor[] = [];
  selectedDonor: Donor | undefined;
  categoryData: Category[] = [];
  selectedCategory: Category | undefined;

  // new image state
  imageSelected = false;
  imagePreview: string | null = null;
  // subscription to imageUrl changes
  private subs = new Subscription();

  fileList: NzUploadFile[] = [];
  id: number | null = null;
  editing: boolean = false;

  // סטייט חדש
  uploadingImage = false;
  // uploadProgress = 0;

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

  constructor(
    private giftService: GiftService,
    private global: GlobalService,
    private router: Router,
    private donorService: DonorService,
    private categoryService: CategoryService,
    private msg: NzMessageService,
    private http: HttpClient,
    public filesService: FilesService,
    private activateRoute: ActivatedRoute,
  ) { }

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
          this.selectedDonor = this.validateForm.controls['donorId'].value;
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
    this.donorService.getDonorByLotteryId(this.currentLotteryId).subscribe({
      next: (donors: Donor[]) => {
        this.donorData = donors;
      },
      error: (error) => {
        if (error.status === 404) {
          this.msg.error('לא נמצאו תורמים עבור הגרלה זו');
          console.error('No donors found for this lottery:', error);
        } else {
          this.msg.error('שגיאה בטעינת תורמים');
          console.error('Error fetching donors:', error);
        }
      }
    });
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categoryData = categories;
        if (categories.length === 0) {
          this.msg.warning('לא נמצאו קטגוריות');
        }
        console.log('Categories fetched successfully:', categories);
      },
      error: (error) => {
        this.msg.error('שגיאה בטעינת קטגוריות');
        console.error('Error fetching categories:', error);
      }
    });

    // watch imageUrl field to update preview when user pastes a URL manually
    this.subs.add(
      this.validateForm.controls['imageUrl'].valueChanges.subscribe((val: string) => {
        if (val) {
          // if it's a data URL or http(s) url or ends with image extension show preview
          if (val.startsWith('data:') || val.startsWith('http') || /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/i.test(val)) {
            this.imagePreview = val;
            this.imageSelected = true;
          } else {
            // not image-like: keep but don't show preview
            this.imagePreview = null;
            this.imageSelected = false;
          }
        } else {
          this.imagePreview = null;
          this.imageSelected = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // called by nz-upload before upload; we read file as dataURL and prevent actual upload (return false)
  beforeUpload = (file: NzUploadFile): boolean => {
    const nativeFile = file as any as File;
    this.uploadingImage = true;
    this.filesService.uploadFileAndGetUrl(nativeFile).subscribe({
      next: (url) => {
        if (url) {
          // אל תוסיף prefix; השתמש בערך המלא שחזר מהשרת
          this.validateForm.controls['imageUrl'].setValue(url);
          this.imagePreview = url;
          this.imageSelected = true;
          this.msg.success('התמונה הועלתה בהצלחה');
        } else {
          this.msg.error('השרת החזיר כתובת ריקה');
        }
        this.uploadingImage = false;
      },
      error: (err) => {
        console.error(err);
        if (err.status === 400) {
          this.msg.error('הקובץ אינו תקין או גדול מדי');
        } else {
          this.msg.error('העלאת קובץ נכשלה');
        }
        this.uploadingImage = false;
      }
    });

    return false;
  };

  // פונקציה שמבצעת POST לשרת ומחזירה Observable<string> עם הכתובת
  removeImage(): void {
    this.imageSelected = false;
    this.imagePreview = null;
    this.validateForm.controls['imageUrl'].setValue('');
    this.fileList = [];
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
      this.giftService.createGift(this.validateForm.value).subscribe({
        next: (newGift: GiftModel) => {
          console.log('Gift created successfully:', newGift);
          this.msg.success('המתנה נוצרה בהצלחה');
          this.isConfirmLoading = false;
          this.router.navigate(['/gifts']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.msg.error('המתנה לא נוצרה, בדוק את הפרטים ונסה שוב');
          } else {
            this.msg.error('שגיאה ביצירת המתנה');
          }
          console.error('Error creating gift:', error);
          this.isConfirmLoading = false;
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
