import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMapHistoryComponent } from './panel-map-history.component';

describe('PanelMapHistoryComponent', () => {
  let component: PanelMapHistoryComponent;
  let fixture: ComponentFixture<PanelMapHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelMapHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMapHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
