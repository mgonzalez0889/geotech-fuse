import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDispatchComponent } from './grid-dispatch.component';

describe('GridDispatchComponent', () => {
  let component: GridDispatchComponent;
  let fixture: ComponentFixture<GridDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridDispatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
