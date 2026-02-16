import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPackage } from './post-package';

describe('PostPackage', () => {
  let component: PostPackage;
  let fixture: ComponentFixture<PostPackage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPackage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPackage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
