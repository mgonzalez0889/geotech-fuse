import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OsmMapsRoutingModule } from './osm-maps-routing.module';
import { MapsComponent } from './maps/maps.component';


@NgModule({
  declarations: [
    MapsComponent
  ],
  imports: [
    CommonModule,
    OsmMapsRoutingModule
  ]
})
export class OsmMapsModule { }
