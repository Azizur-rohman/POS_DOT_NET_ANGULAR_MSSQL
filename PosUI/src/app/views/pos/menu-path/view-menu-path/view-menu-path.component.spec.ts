import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMenuPathComponent } from './view-menu-path.component';

describe('ViewMenuPathComponent', () => {
  let component: ViewMenuPathComponent;
  let fixture: ComponentFixture<ViewMenuPathComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMenuPathComponent]
    });
    fixture = TestBed.createComponent(ViewMenuPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
