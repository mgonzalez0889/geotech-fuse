import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MapRequestService } from 'app/core/services/request/map-request.service';
import { map } from 'lodash';

@Component({
  selector: 'app-form-geometry',
  templateUrl: './form-geometry.component.html',
  styleUrls: ['./form-geometry.component.scss']
})
export class FormGeometryComponent implements OnInit {
  public formGeometry: FormGroup;
  public titleForm: string;

  constructor(
    private fb: FormBuilder,
    public mapFunctionalitieService: MapFunctionalitieService,
    public mapRequestService: MapRequestService
  ) { }

  ngOnInit(): void {
    this.titleForm = 'Nuevo ' + this.mapFunctionalitieService.type_geometry;
    this.createGeometryForm();
  }

  private createGeometryForm(): void {
    this.formGeometry = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', []],
      shape: ['', [Validators.required]],
      diameter: [0, [Validators.required]],
    });
  }

  async saveGeometry() {
    this.formGeometry.controls.shape.setValue(this.mapFunctionalitieService.shape);
    this.formGeometry.controls.diameter.setValue(12);

    let data = await this.mapRequestService.saveGeometry(this.mapFunctionalitieService.type_geo, this.formGeometry.value);
    if (data === 200) {
      this.mapFunctionalitieService.drawerOpenedChanged();
      this.mapFunctionalitieService.showFormGeomertry = false;
      await this.mapRequestService.getGeometry(this.mapFunctionalitieService.type_geo + 's') || [];
      this.mapFunctionalitieService.showMenuMobiles = true;
      this.mapFunctionalitieService.loadAllsMobiles();
      this.mapFunctionalitieService.goDeleteGeometryPath();

    }
  }

  goCancel() {
    this.mapFunctionalitieService.goCancelToGeometry();
  }

}
