import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsRoutingModule } from './maps-routing.module';
import { MapComponent } from './map/map.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PanelMapMainComponent } from './panel-map-main/panel-map-main.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { _MatMenuDirectivesModule } from '@angular/material/menu';
import { FormReportMapComponent } from './form-report-map/form-report-map.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PanelMapHistoryComponent } from './panel-map-history/panel-map-history.component';
import { PopupMapComponent } from './popup-map/popup-map.component';
import { PanelMapDetailsComponent } from './panel-map-details/panel-map-details.component';
import { PanelMapCommandsComponent } from './panel-map-commands/panel-map-commands.component';

@NgModule({
  declarations: [
    MapComponent,
    PanelMapMainComponent,
    FormReportMapComponent,
    PanelMapHistoryComponent,
    PopupMapComponent,
    PanelMapDetailsComponent,
    PanelMapCommandsComponent,
  ],
  imports: [
    CommonModule,
    MapsRoutingModule,
    SharedModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatInputModule,
    MatDialogModule
  ],
})
export class MapsModule { }
