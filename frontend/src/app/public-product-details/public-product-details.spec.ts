import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProductDetails } from './public-product-details';

describe('PublicProductDetails', () => {
  let component: PublicProductDetails;
  let fixture: ComponentFixture<PublicProductDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicProductDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicProductDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
