import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingMenuDetailComponent } from './floating-menu-detail.component';

describe('FloatingMenuDetailComponent', () => {
  let component: FloatingMenuDetailComponent;
  let fixture: ComponentFixture<FloatingMenuDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatingMenuDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingMenuDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
