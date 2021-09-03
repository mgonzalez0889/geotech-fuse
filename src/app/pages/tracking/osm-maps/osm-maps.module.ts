import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OsmMapsRoutingModule } from './osm-maps-routing.module';
import { MapsComponent } from './maps/maps.component';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { FloatingMenuComponent } from './floating-menu/floating-menu.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FuseCardModule} from "../../../../@fuse/components/card";
import { FormDialogSelectHistorialComponent } from './form-dialog-select-historial/form-dialog-select-historial.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";


@NgModule({
  declarations: [
    MapsComponent,
    FloatingMenuComponent,
    FormDialogSelectHistorialComponent
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

    ]
})
export class OsmMapsModule { }
