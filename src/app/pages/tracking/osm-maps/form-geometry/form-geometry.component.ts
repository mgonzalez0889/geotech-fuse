import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MapRequestService } from 'app/core/services/request/map-request.service';
import * as L from 'leaflet';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
    selector: 'app-form-geometry',
    templateUrl: './form-geometry.component.html',
    styleUrls: ['./form-geometry.component.scss'],
})
export class FormGeometryComponent implements OnInit {
    public formGeometry: FormGroup;
    public titleForm: string;
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    public selectedFile: any = null;
    public showForm;
    public geoJsonData;

    constructor(
        private fb: FormBuilder,
        public mapFunctionalitieService: MapFunctionalitieService,
        public mapRequestService: MapRequestService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.showForm = this.mapFunctionalitieService.showForm;
        this.titleForm = 'Nuevo ' + this.mapFunctionalitieService.type_geometry;
        this.createGeometryForm();
    }

    async saveGeometry() {
        if (this.mapFunctionalitieService.type_geo === 'owner_map') {
            const data = await this.mapRequestService.saveGeometry(
                'owner_map',
                this.geoJsonData
            );
            if (data === 200) {
                this.mapFunctionalitieService.drawerOpenedChanged();
                this.mapFunctionalitieService.showFormGeomertry = false;
                (await this.mapRequestService.getGeometry(
                    this.mapFunctionalitieService.type_geo + 's'
                )) || [];
                this.mapFunctionalitieService.showMenuMobiles = true;
                this.mapFunctionalitieService.loadAllsMobiles();
                this.mapFunctionalitieService.goDeleteGeometryPath();
                this._snackBar.open('Geometria creada!', 'Cerrar', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    duration: 5000,
                });
            }
        } else {
            if (this.showForm) {
                this.formGeometry.controls.shape.setValue(
                    this.mapFunctionalitieService.shape
                );
                this.formGeometry.controls.diameter.setValue(12);
                const data = await this.mapRequestService.saveGeometry(
                    this.mapFunctionalitieService.type_geo,
                    this.formGeometry.value
                );
                if (data === 200) {
                    this.mapFunctionalitieService.drawerOpenedChanged();
                    this.mapFunctionalitieService.showFormGeomertry = false;
                    (await this.mapRequestService.getGeometry(
                        this.mapFunctionalitieService.type_geo + 's'
                    )) || [];
                    this.mapFunctionalitieService.showMenuMobiles = true;
                    this.mapFunctionalitieService.loadAllsMobiles();
                    this.mapFunctionalitieService.goDeleteGeometryPath();
                    this._snackBar.open('Geometria creada!', 'Cerrar', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 5000,
                    });
                }
            } else {
                const data = await this.mapRequestService.saveGeometry(
                    'masive_points',
                    this.geoJsonData
                );
                if (data === 200) {
                    this.mapFunctionalitieService.drawerOpenedChanged();
                    this.mapFunctionalitieService.showFormGeomertry = false;
                    (await this.mapRequestService.getGeometry(
                        this.mapFunctionalitieService.type_geo + 's'
                    )) || [];
                    this.mapFunctionalitieService.showMenuMobiles = true;
                    this.mapFunctionalitieService.loadAllsMobiles();
                    this.mapFunctionalitieService.goDeleteGeometryPath();
                    this._snackBar.open('Geometria creada!', 'Cerrar', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 5000,
                    });
                }
                console.log(this.geoJsonData);
            }
        }
    }
    confirmations() {}

    public goCancel(): void {
        this.mapFunctionalitieService.goCancelToGeometry();
    }
    public onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0] ?? null;
        const fileReader = new FileReader();
        fileReader.onload = (fileLoadedEvent): void => {
            this.geoJsonData = JSON.parse(
                fileLoadedEvent.target.result as string
            );

            // L.geoJSON(json, {
            //     pointToLayer: function (feature, latlng) {
            //         return L.marker(latlng, {
            //             icon: L.icon({
            //                 iconUrl: '../assets/icons/iconMap/punt.svg',
            //                 iconSize: [40, 40],
            //                 iconAnchor: [20, 20],
            //             }),
            //         });
            //     },
            // }).addTo(this.mapFunctionalitieService.map);
        };
        fileReader.readAsText(this.selectedFile);
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
}
