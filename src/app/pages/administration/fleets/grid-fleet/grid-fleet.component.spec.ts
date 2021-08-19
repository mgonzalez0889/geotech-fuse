import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFleetComponent } from './grid-fleet.component';

describe('GridFleetComponent', () => {
  let component: GridFleetComponent;
  let fixture: ComponentFixture<GridFleetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridFleetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
