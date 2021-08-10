import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridMenuOptionsComponent } from './grid-menu-options.component';

describe('GridMenuOptionsComponent', () => {
  let component: GridMenuOptionsComponent;
  let fixture: ComponentFixture<GridMenuOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridMenuOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridMenuOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
