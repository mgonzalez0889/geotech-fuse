import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridMaintenanceComponent } from './grid-maintenance.component';

describe('GridMaintenanceComponent', () => {
  let component: GridMaintenanceComponent;
  let fixture: ComponentFixture<GridMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
