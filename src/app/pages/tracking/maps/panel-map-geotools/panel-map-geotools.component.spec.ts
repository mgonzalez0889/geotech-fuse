import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMapGeotoolsComponent } from './panel-map-geotools.component';

describe('PanelMapGeotoolsComponent', () => {
  let component: PanelMapGeotoolsComponent;
  let fixture: ComponentFixture<PanelMapGeotoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelMapGeotoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMapGeotoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
