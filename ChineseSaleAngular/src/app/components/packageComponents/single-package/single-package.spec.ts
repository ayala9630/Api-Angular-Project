import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePackage } from './single-package';

describe('SinglePackage', () => {
  let component: SinglePackage;
  let fixture: ComponentFixture<SinglePackage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePackage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePackage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
