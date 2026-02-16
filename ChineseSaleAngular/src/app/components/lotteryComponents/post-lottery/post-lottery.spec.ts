import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLottery } from './post-lottery';

describe('PostLottery', () => {
  let component: PostLottery;
  let fixture: ComponentFixture<PostLottery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostLottery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostLottery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
