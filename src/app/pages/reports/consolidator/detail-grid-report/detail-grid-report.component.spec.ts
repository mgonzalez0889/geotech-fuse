import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGridReportComponent } from './detail-grid-report.component';

describe('DetailGridReportComponent', () => {
  let component: DetailGridReportComponent;
  let fixture: ComponentFixture<DetailGridReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailGridReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGridReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
