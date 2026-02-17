import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global/global.service';
import { PackageService } from '../../../services/package/package.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CreateLottery, CreatePackage, Lottery, UpdateLottery, UpdatePackage } from '../../../models';
import { LotteryService } from '../../../services/lottery/lottery.service';

@Component({
  selector: 'app-post-lottery',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './post-lottery.html',
  styleUrl: './post-lottery.scss',
})
export class PostLottery {
  constructor(
    private lotteryService: LotteryService,
    private global: GlobalService,
    private router: Router,
    private msg: NzMessageService,
    private activateRoute: ActivatedRoute
  ) { }

  isConfirmLoading = false;
  id: number | null = null;
  editing: boolean = false;

  private fb = inject(NonNullableFormBuilder);

  private toDateInputValue(value: string | Date): string {
    const date = value instanceof Date ? new Date(value) : new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  }

  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    startDate: [this.toDateInputValue(new Date()), [Validators.required]],
    endDate: [this.toDateInputValue(new Date()), [Validators.required]],
  });

  
  
  ngOnInit(): void {
    const currentLottery = this.global.currentLottery();
    if (currentLottery) {
      this.activateRoute.params.subscribe(params => {
        this.id = +params['id'];  // Convert string to number
        if (this.id) {
          this.editing = true;
          this.lotteryService.getLotteryById(this.id).subscribe({
            next: (lottery) => {
              console.log("name:",this.validateForm.controls.name.value);
              console.log("startDate:",this.validateForm.controls.startDate.value);
              console.log("endDate:",this.validateForm.controls.endDate.value);
              
              this.validateForm.patchValue({
                name: lottery?.name || '',
                startDate: lottery?.startDate ? this.toDateInputValue(lottery.startDate) : '',
                endDate: lottery?.endDate ? this.toDateInputValue(lottery.endDate) : '',
              });
              console.log("name:",this.validateForm.controls.name.value);
              console.log("startDate:",this.validateForm.controls.startDate.value);
              console.log("endDate:",this.validateForm.controls.endDate.value);
              
              
            },
            error: (error) => {
              console.error('Error fetching lottery:', error);
              this.msg.error('הגרלה לא קיימת')
              this.router.navigateByUrl('home');
            }
          })
        }
      });
      // this.validateForm.patchValue({ lotteryId: this.global.currentLotteryId() });
    }
  }
    submitForm(): void {
      if (!this.editing) {
        if (this.validateForm.valid) {
          this.isConfirmLoading = true;
          const formValue = this.validateForm.value;
          const lotteryData: CreateLottery = {
            id: 0,
            name: formValue.name || '',
            startDate: new Date(formValue.startDate || ''),
            endDate: new Date(formValue.endDate || ''),
          };
  
          this.lotteryService.addLottery(lotteryData).subscribe({
            next: (newLottery: Lottery) => {
              console.log('Lottery created successfully:', newLottery);
              this.isConfirmLoading = false;
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error('Error creating lottery:', error);
              this.isConfirmLoading = false;
            }
          });
        }
      } else {
        const updatePayload: UpdateLottery = {
          ...(this.validateForm.value as UpdateLottery),
        };
        updatePayload.id = this.id!;
  
        this.lotteryService.updateLottery(updatePayload).subscribe({
          next: () => {
            console.log('פרטי ההגרלה התעדכנו בהצלחה');
            this.msg.success('פרטי ההגרלה התעדכנו בהצלחה');
            this.router.navigateByUrl('/home');
          },
          error: () => {
            console.error('שגיאה בעדכון ההגרלה');
            this.msg.error('שגיאה בעדכון ההגרלה');
          }
        });
      }
    }
  
    cancel(): void {
      this.router.navigate(['/home']);
    }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    this.router.navigateByUrl('/home');
  }
}

