import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridUserOptionProfileComponent } from './grid-user-option-profile.component';

describe('GridUserOptionProfileComponent', () => {
  let component: GridUserOptionProfileComponent;
  let fixture: ComponentFixture<GridUserOptionProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridUserOptionProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridUserOptionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
