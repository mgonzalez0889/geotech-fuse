import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { SharedModule } from 'app/shared/shared.module';
import { MapsRoutingModule } from './maps-routing.module';
import { _MatMenuDirectivesModule } from '@angular/material/menu';
import { PopupMapComponent } from './popup-map/popup-map.component';
import { PanelMapMainComponent } from './panel-map-main/panel-map-main.component';
import { FormReportMapComponent } from './form-report-map/form-report-map.component';
import { FormGeotoolMapComponent } from './form-geotool-map/form-geotool-map.component';
import { PanelMapHistoryComponent } from './panel-map-history/panel-map-history.component';
import { PanelMapDetailsComponent } from './panel-map-details/panel-map-details.component';
import { PanelMapCommandsComponent } from './panel-map-commands/panel-map-commands.component';
import { PanelMapGeotoolsComponent } from './panel-map-geotools/panel-map-geotools.component';
import { ModalImportGeojsonComponent } from './modal-import-geojson/modal-import-geojson.component';

@NgModule({
  declarations: [
    MapComponent,
    PanelMapMainComponent,
    FormReportMapComponent,
    PanelMapHistoryComponent,
    PopupMapComponent,
    PanelMapDetailsComponent,
    PanelMapCommandsComponent,
    PanelMapGeotoolsComponent,
    FormGeotoolMapComponent,
    ModalImportGeojsonComponent,
  ],
  imports: [
    CommonModule,
    MapsRoutingModule,
    SharedModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'map' }],
})
export class MapsModule { }
