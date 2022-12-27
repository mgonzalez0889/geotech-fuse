import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCommandsComponent } from './form-commands.component';

describe('FormCommandsComponent', () => {
  let component: FormCommandsComponent;
  let fixture: ComponentFixture<FormCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCommandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
