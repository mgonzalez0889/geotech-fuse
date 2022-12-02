import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PanelMapGeotoolsComponent } from '../panel-map-geotools/panel-map-geotools.component';

@Component({
  selector: 'app-modal-import-geojson',
  templateUrl: './modal-import-geojson.component.html',
  styleUrls: ['./modal-import-geojson.component.scss']
})
export class ModalImportGeojsonComponent implements OnInit {
  public selectedFile: any = null;
  public geoJson: any = null;
  public disabledButton: boolean = true;
  constructor(public dialogRef: MatDialogRef<PanelMapGeotoolsComponent>,) { }

  ngOnInit(): void { }

  public onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    const fileReader = new FileReader();

    fileReader.onload = (fileLoadedEvent): void => {
      this.geoJson = JSON.parse(
        fileLoadedEvent.target.result as string
      );
      this.disabledButton = this.geoJson ? false : true;

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

}
