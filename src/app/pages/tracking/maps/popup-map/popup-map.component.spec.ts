import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMapComponent } from './popup-map.component';

describe('PopupMapComponent', () => {
  let component: PopupMapComponent;
  let fixture: ComponentFixture<PopupMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
