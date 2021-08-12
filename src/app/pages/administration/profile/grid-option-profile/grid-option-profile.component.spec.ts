import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridOptionProfileComponent } from './grid-option-profile.component';

describe('GridOptionProfileComponent', () => {
  let component: GridOptionProfileComponent;
  let fixture: ComponentFixture<GridOptionProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridOptionProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridOptionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
