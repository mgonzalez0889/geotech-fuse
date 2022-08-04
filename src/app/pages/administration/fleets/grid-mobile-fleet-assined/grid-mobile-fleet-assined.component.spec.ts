import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridMobileFleetAssinedComponent } from './grid-mobile-fleet-assined.component';

describe('GridMobileFleetAssinedComponent', () => {
  let component: GridMobileFleetAssinedComponent;
  let fixture: ComponentFixture<GridMobileFleetAssinedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridMobileFleetAssinedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridMobileFleetAssinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
