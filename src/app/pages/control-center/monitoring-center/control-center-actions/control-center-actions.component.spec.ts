import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCenterActionsComponent } from './control-center-actions.component';

describe('ControlCenterActionsComponent', () => {
  let component: ControlCenterActionsComponent;
  let fixture: ComponentFixture<ControlCenterActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlCenterActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
