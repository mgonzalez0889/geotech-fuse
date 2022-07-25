import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridContactComponent } from './grid-contact.component';

describe('GridContactComponent', () => {
  let component: GridContactComponent;
  let fixture: ComponentFixture<GridContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
