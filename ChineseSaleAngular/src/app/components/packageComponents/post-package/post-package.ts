import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global/global.service';
import { PackageService } from '../../../services/package/package.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CreatePackage, UpdatePackage } from '../../../models';

@Component({
  selector: 'app-post-package',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './post-package.html',
  styleUrl: './post-package.scss',
})
export class PostPackage {

  constructor(
    private packageService: PackageService,
    private global: GlobalService,
    private router: Router,
    private msg: NzMessageService,
    private activateRoute: ActivatedRoute
  ) { }

  isConfirmLoading = false;
  id: number | null = null;
  editing: boolean = false;

  private fb = inject(NonNullableFormBuilder);

  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    imageUrl: [''],
    numOfCards: [0, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
    LotteryId: [0, [Validators.required]],
  });

  
  
  ngOnInit(): void {
    const currentLottery = this.global.currentLottery();
    if (currentLottery) {
      this.validateForm.controls['LotteryId'].setValue(currentLottery.id);
      this.activateRoute.params.subscribe(params => {
        this.id = +params['id'];  // Convert string to number
        if (this.id) {
          this.editing = true;
          this.packageService.getPackageForUpdate(this.id).subscribe({
            next: (pkg) => {
              console.log("pkg",pkg);
              // console.log("typkg",typeof pkg);
              this.validateForm.patchValue({
                name: pkg.name,
                description: pkg.description,
                imageUrl: pkg.imageUrl,
                numOfCards: pkg.numOfCards,
                price: pkg.price,
              });
              
            },
            error: (error) => {
              console.error('Error fetching package:', error);
              this.msg.error('חבילה לא קיימת')
              this.router.navigateByUrl('packages')
            }
          })
        }
      });
      // this.validateForm.patchValue({ lotteryId: this.global.currentLotteryId() });
    }
  }
    submitForm(): void {
      console.log("submit form");
      console.log("id:", this.id);
      console.log("editing:", this.editing);
       // console.log(this.validateForm.value);
      if (!this.editing) {
        if (this.validateForm.valid) {
          this.isConfirmLoading = true;
          const packageData: CreatePackage = {
            ...this.validateForm.value as CreatePackage,
            // lotteryId: this.global.currentLotteryId()
          };
  
          this.packageService.addPackage(packageData).subscribe({
            next: (newPackage: number) => {
              console.log('Package created successfully:', newPackage);
              this.isConfirmLoading = false;
              this.router.navigate(['/packages']);
            },
            error: (error) => {
              console.error('Error creating package:', error);
              this.isConfirmLoading = false;
            }
          });
        }
      } else {
        const updatePayload: UpdatePackage = {
          ...(this.validateForm.value as UpdatePackage),
        };
        updatePayload.id = this.id!;
  
        this.packageService.updatePackage(updatePayload).subscribe({
          next: () => {
            console.log('פרטי החבילה התעדכנו בהצלחה');
            this.msg.success('פרטי החבילה התעדכנו בהצלחה');
            this.router.navigateByUrl('/packages');
          },
          error: () => {
            console.error('שגיאה בעדכון החבילה');
            this.msg.error('שגיאה בעדכון החבילה');
          }
        });
      }
    }
  
    cancel(): void {
      this.router.navigate(['/packages']);
    }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    this.router.navigateByUrl('/packages');
  }
}
