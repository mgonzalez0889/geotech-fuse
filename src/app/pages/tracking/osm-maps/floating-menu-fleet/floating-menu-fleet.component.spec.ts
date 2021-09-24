import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingMenuFleetComponent } from './floating-menu-fleet.component';

describe('FloatingMenuFleetComponent', () => {
  let component: FloatingMenuFleetComponent;
  let fixture: ComponentFixture<FloatingMenuFleetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatingMenuFleetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingMenuFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
