import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { FormEventsComponent } from './form-events/form-events.component';
import { GridEventsComponent } from './grid-events/grid-events.component';
import { SharedModule } from '../../../shared/shared.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@NgModule({
  declarations: [FormEventsComponent, GridEventsComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'events' }],
})
export class EventsModule { }
