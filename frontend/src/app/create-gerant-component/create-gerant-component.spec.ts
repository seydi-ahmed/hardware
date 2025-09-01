import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGerantComponent } from './create-gerant-component';

describe('CreateGerantComponent', () => {
  let component: CreateGerantComponent;
  let fixture: ComponentFixture<CreateGerantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGerantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGerantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
