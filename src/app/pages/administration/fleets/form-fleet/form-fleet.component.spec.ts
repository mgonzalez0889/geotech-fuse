import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFleetComponent } from './form-fleet.component';

describe('FormFleetComponent', () => {
  let component: FormFleetComponent;
  let fixture: ComponentFixture<FormFleetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFleetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
