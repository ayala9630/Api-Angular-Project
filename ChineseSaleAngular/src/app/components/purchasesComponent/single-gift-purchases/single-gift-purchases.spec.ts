import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGiftPurchases } from './single-gift-purchases';

describe('SingleGiftPurchases', () => {
  let component: SingleGiftPurchases;
  let fixture: ComponentFixture<SingleGiftPurchases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleGiftPurchases]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleGiftPurchases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
