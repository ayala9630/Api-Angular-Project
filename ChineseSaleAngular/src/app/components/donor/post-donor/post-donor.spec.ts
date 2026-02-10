import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDonor } from './post-donor';

describe('PostDonor', () => {
  let component: PostDonor;
  let fixture: ComponentFixture<PostDonor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDonor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDonor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
