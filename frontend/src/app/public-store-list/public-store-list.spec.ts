import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicStoreList } from './public-store-list';

describe('PublicStoreList', () => {
  let component: PublicStoreList;
  let fixture: ComponentFixture<PublicStoreList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicStoreList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicStoreList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
