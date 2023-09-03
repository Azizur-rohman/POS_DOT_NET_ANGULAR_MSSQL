import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserRoleComponent } from './add-user-role.component';

describe('AddUserRoleComponent', () => {
  let component: AddUserRoleComponent;
  let fixture: ComponentFixture<AddUserRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserRoleComponent]
    });
    fixture = TestBed.createComponent(AddUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
