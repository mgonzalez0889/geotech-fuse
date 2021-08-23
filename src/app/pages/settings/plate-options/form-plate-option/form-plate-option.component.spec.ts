import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPlateOptionComponent } from './form-plate-option.component';

describe('FormPlateOptionComponent', () => {
  let component: FormPlateOptionComponent;
  let fixture: ComponentFixture<FormPlateOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPlateOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPlateOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
