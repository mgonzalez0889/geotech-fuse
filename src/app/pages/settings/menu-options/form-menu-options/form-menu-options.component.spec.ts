import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMenuOptionsComponent } from './form-menu-options.component';

describe('FormMenuOptionsComponent', () => {
  let component: FormMenuOptionsComponent;
  let fixture: ComponentFixture<FormMenuOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMenuOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMenuOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
