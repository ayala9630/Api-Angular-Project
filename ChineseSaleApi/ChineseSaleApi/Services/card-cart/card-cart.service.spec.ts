import { TestBed } from '@angular/core/testing';
import { CardCartService } from './card-cart.service';

describe('CardCartService', () => {
  let service: CardCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
