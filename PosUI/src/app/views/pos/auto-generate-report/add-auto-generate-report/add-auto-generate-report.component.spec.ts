import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAutoGenerateReportComponent } from './add-auto-generate-report.component';

describe('AddAutoGenerateReportComponent', () => {
  let component: AddAutoGenerateReportComponent;
  let fixture: ComponentFixture<AddAutoGenerateReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAutoGenerateReportComponent]
    });
    fixture = TestBed.createComponent(AddAutoGenerateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
