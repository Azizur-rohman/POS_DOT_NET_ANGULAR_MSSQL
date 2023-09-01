import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultTitlebarComponent } from './default-titlebar.component';

describe('DefaultTitlebarComponent', () => {
  let component: DefaultTitlebarComponent;
  let fixture: ComponentFixture<DefaultTitlebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultTitlebarComponent]
    });
    fixture = TestBed.createComponent(DefaultTitlebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
