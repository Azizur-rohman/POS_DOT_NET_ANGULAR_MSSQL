import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserCategoryComponent } from './view-user-category.component';

describe('ViewUserCategoryComponent', () => {
  let component: ViewUserCategoryComponent;
  let fixture: ComponentFixture<ViewUserCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUserCategoryComponent]
    });
    fixture = TestBed.createComponent(ViewUserCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
