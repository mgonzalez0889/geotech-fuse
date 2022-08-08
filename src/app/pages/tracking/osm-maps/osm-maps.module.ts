import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OsmMapsRoutingModule } from './osm-maps-routing.module';
import { MapsComponent } from './maps/maps.component';
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FloatingMenuComponent } from './floating-menu/floating-menu.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FuseCardModule } from "../../../../@fuse/components/card";
import { FormDialogSelectHistorialComponent } from './form-dialog-select-historial/form-dialog-select-historial.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { FuseDateRangeModule } from "../../../../@fuse/components/date-range";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { FormAssignMarkComponent } from './form-assign-mark/form-assign-mark.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FuseDrawerModule } from "../../../../@fuse/components/drawer";
import { MatInputModule } from "@angular/material/input";
import { FloatingMenuFleetComponent } from './floating-menu-fleet/floating-menu-fleet.component';
import { FormDetailMobileComponent } from './form-detail-mobile/form-detail-mobile.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FuseAlertModule } from "../../../../@fuse/components/alert";
import { _MatMenuDirectivesModule, MatMenuModule } from "@angular/material/menu";
import { FloatingMenuDetailComponent } from './floating-menu-detail/floating-menu-detail.component';
import { InfoWindowsComponent } from './info-windows/info-windows.component';
import { GeotoolsComponent } from './geotools/geotools.component';
import { MatListModule } from "@angular/material/list";
import { FormGeometryComponent } from './form-geometry/form-geometry.component';
import { HistoricsComponent } from './historics/historics.component';
import { CommandsComponent } from './commands/commands.component';

@NgModule({
  declarations: [
    MapsComponent,
    FloatingMenuComponent,
    FormDialogSelectHistorialComponent,
    FormAssignMarkComponent,
    FloatingMenuFleetComponent,
    FormDetailMobileComponent,
    FloatingMenuDetailComponent,
    InfoWindowsComponent,
    GeotoolsComponent,
    FormGeometryComponent,
    HistoricsComponent,
    CommandsComponent,
  ],
  imports: [
    CommonModule,
    OsmMapsRoutingModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    FuseCardModule,
    MatDialogModule,
    MatDividerModule,
    FuseDateRangeModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatTooltipModule,
    FuseDrawerModule,
    FormsModule,
    MatInputModule,
    DragDropModule,
    FuseAlertModule,
    _MatMenuDirectivesModule,
    MatMenuModule,
    MatListModule

  ],
  entryComponents: [
    InfoWindowsComponent,
  ]
})
export class OsmMapsModule { }
