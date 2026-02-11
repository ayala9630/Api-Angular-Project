import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGift } from './single-gift';

describe('SingleGift', () => {
  let component: SingleGift;
  let fixture: ComponentFixture<SingleGift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleGift]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleGift);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
