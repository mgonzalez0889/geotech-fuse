import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeotoolsComponent } from './geotools.component';

describe('GeotoolsComponent', () => {
  let component: GeotoolsComponent;
  let fixture: ComponentFixture<GeotoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeotoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeotoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
