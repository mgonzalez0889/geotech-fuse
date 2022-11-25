import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMapCommandsComponent } from './panel-map-commands.component';

describe('PanelMapCommandsComponent', () => {
  let component: PanelMapCommandsComponent;
  let fixture: ComponentFixture<PanelMapCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelMapCommandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMapCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
