import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lotttery } from './lotttery';

describe('Lotttery', () => {
  let component: Lotttery;
  let fixture: ComponentFixture<Lotttery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lotttery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lotttery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
