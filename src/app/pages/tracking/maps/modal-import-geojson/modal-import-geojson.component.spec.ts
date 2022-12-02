import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImportGeojsonComponent } from './modal-import-geojson.component';

describe('ModalImportGeojsonComponent', () => {
  let component: ModalImportGeojsonComponent;
  let fixture: ComponentFixture<ModalImportGeojsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalImportGeojsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalImportGeojsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
