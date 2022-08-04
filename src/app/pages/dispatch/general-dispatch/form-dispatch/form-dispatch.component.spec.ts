import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDispatchComponent } from './form-dispatch.component';

describe('FormDispatchComponent', () => {
  let component: FormDispatchComponent;
  let fixture: ComponentFixture<FormDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDispatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
