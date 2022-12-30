import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMobilesComponent } from './form-mobiles.component';

describe('FormMobilesComponent', () => {
  let component: FormMobilesComponent;
  let fixture: ComponentFixture<FormMobilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMobilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMobilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
