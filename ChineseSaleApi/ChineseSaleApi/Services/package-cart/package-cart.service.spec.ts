import { TestBed } from '@angular/core/testing';
import { PackageCartService } from './package-cart.service';

describe('PackageCartService', () => {
  let service: PackageCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
