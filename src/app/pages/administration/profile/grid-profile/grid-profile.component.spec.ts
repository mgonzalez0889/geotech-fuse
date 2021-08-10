import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridProfileComponent } from './grid-profile.component';

describe('GridProfileComponent', () => {
  let component: GridProfileComponent;
  let fixture: ComponentFixture<GridProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
