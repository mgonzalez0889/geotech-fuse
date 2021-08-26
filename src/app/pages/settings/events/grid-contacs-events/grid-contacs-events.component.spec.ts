import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridContacsEventsComponent } from './grid-contacs-events.component';

describe('GridContacsEventsComponent', () => {
  let component: GridContacsEventsComponent;
  let fixture: ComponentFixture<GridContacsEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridContacsEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridContacsEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
