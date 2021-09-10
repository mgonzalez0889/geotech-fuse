import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogSelectHistorialComponent } from './form-dialog-select-historial.component';

describe('FormDialogSelectHistorialComponent', () => {
  let component: FormDialogSelectHistorialComponent;
  let fixture: ComponentFixture<FormDialogSelectHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDialogSelectHistorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogSelectHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
