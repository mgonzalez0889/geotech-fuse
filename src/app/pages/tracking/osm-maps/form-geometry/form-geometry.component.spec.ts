import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGeometryComponent } from './form-geometry.component';

describe('FormGeometryComponent', () => {
  let component: FormGeometryComponent;
  let fixture: ComponentFixture<FormGeometryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormGeometryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGeometryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
