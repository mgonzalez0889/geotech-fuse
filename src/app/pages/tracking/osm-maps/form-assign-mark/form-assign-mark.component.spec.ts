import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAssignMarkComponent } from './form-assign-mark.component';

describe('FormAssignMarkComponent', () => {
  let component: FormAssignMarkComponent;
  let fixture: ComponentFixture<FormAssignMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAssignMarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAssignMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
