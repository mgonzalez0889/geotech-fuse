import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGeotoolMapComponent } from './form-geotool-map.component';

describe('FormGeotoolMapComponent', () => {
  let component: FormGeotoolMapComponent;
  let fixture: ComponentFixture<FormGeotoolMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormGeotoolMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGeotoolMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
