import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicStoreProducts } from './public-store-products';

describe('PublicStoreProducts', () => {
  let component: PublicStoreProducts;
  let fixture: ComponentFixture<PublicStoreProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicStoreProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicStoreProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
