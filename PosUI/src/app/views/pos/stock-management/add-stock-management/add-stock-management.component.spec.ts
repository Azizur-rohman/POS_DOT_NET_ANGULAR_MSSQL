import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockManagementComponent } from './add-stock-management.component';

describe('AddStockManagementComponent', () => {
  let component: AddStockManagementComponent;
  let fixture: ComponentFixture<AddStockManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStockManagementComponent]
    });
    fixture = TestBed.createComponent(AddStockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
