import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserCategoryComponent } from './add-user-category.component';

describe('AddUserCategoryComponent', () => {
  let component: AddUserCategoryComponent;
  let fixture: ComponentFixture<AddUserCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserCategoryComponent]
    });
    fixture = TestBed.createComponent(AddUserCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
