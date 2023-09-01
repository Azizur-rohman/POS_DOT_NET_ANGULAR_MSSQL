import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserEntryComponent } from './view-user-entry.component';

describe('ViewUserEntryComponent', () => {
  let component: ViewUserEntryComponent;
  let fixture: ComponentFixture<ViewUserEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUserEntryComponent]
    });
    fixture = TestBed.createComponent(ViewUserEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
