import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicStoreDetails } from './public-store-details';

describe('PublicStoreDetails', () => {
  let component: PublicStoreDetails;
  let fixture: ComponentFixture<PublicStoreDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicStoreDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicStoreDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
