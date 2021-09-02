import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OsmMapsRoutingModule } from './osm-maps-routing.module';
import { MapsComponent } from './maps/maps.component';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { FloatingMenuComponent } from './floating-menu/floating-menu.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    MapsComponent,
    FloatingMenuComponent
  ],
    imports: [
        CommonModule,
        OsmMapsRoutingModule,
        MatTableModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,

    ]
})
export class OsmMapsModule { }
