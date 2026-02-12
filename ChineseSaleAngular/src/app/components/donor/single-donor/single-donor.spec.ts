import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDonor } from './single-donor';

describe('SingleDonor', () => {
  let component: SingleDonor;
  let fixture: ComponentFixture<SingleDonor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleDonor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleDonor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
