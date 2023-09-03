import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuPathComponent } from './add-menu-path.component';

describe('AddMenuPathComponent', () => {
  let component: AddMenuPathComponent;
  let fixture: ComponentFixture<AddMenuPathComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMenuPathComponent]
    });
    fixture = TestBed.createComponent(AddMenuPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
