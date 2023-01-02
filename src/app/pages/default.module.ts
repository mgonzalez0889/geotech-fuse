import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultRoutingModule } from './default-routing.module';
import { FleetsService } from '../core/services/api/fleets.service';

@NgModule({
  imports: [CommonModule, DefaultRoutingModule],
})
export class DefaultModule {

  constructor(private fleetService: FleetsService) {
    this.fleetService.getFleets().toPromise();
  }
}
