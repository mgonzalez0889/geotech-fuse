import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridMobilesComponent } from './grid-mobiles.component';

describe('GridMobilesComponent', () => {
  let component: GridMobilesComponent;
  let fixture: ComponentFixture<GridMobilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridMobilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridMobilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
