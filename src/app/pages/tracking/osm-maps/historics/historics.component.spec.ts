import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricsComponent } from './historics.component';

describe('HistoricsComponent', () => {
  let component: HistoricsComponent;
  let fixture: ComponentFixture<HistoricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
