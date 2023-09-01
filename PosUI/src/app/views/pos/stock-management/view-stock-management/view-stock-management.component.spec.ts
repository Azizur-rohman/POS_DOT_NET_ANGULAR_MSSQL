import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStockManagementComponent } from './view-stock-management.component';

describe('ViewStockManagementComponent', () => {
  let component: ViewStockManagementComponent;
  let fixture: ComponentFixture<ViewStockManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStockManagementComponent]
    });
    fixture = TestBed.createComponent(ViewStockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
