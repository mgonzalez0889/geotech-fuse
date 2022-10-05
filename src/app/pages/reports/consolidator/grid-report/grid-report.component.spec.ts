import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridReportComponent } from './grid-report.component';

describe('GridReportComponent', () => {
  let component: GridReportComponent;
  let fixture: ComponentFixture<GridReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
