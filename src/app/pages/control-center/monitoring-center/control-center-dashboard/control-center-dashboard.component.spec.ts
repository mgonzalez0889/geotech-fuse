import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterDashboardComponent } from './control-center-dashboard.component';

describe('ControlCenterDashboardComponent', () => {
  let component: ControlCenterDashboardComponent;
  let fixture: ComponentFixture<ControlCenterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlCenterDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
