import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserEntryComponent } from './add-user-entry.component';

describe('AddUserEntryComponent', () => {
  let component: AddUserEntryComponent;
  let fixture: ComponentFixture<AddUserEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserEntryComponent]
    });
    fixture = TestBed.createComponent(AddUserEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
