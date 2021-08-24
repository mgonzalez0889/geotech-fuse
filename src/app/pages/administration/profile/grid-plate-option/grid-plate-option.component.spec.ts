import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPlateOptionComponent } from './grid-plate-option.component';

describe('GridPlateOptionComponent', () => {
  let component: GridPlateOptionComponent;
  let fixture: ComponentFixture<GridPlateOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridPlateOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPlateOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
