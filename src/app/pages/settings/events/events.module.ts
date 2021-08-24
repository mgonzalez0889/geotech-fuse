import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { FormEventsComponent } from './form-events/form-events.component';
import { GridEventsComponent } from './grid-events/grid-events.component';


@NgModule({
  declarations: [
    FormEventsComponent,
    GridEventsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }
