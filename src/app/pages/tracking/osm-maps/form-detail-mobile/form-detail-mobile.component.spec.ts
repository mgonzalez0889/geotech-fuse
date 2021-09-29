import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetailMobileComponent } from './form-detail-mobile.component';

describe('FormDetailMobileComponent', () => {
  let component: FormDetailMobileComponent;
  let fixture: ComponentFixture<FormDetailMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDetailMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDetailMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
