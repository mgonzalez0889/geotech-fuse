import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMapDetailsComponent } from './panel-map-details.component';

describe('PanelMapDetailsComponent', () => {
  let component: PanelMapDetailsComponent;
  let fixture: ComponentFixture<PanelMapDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelMapDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMapDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
