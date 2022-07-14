import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringCenterRoutingModule } from './monitoring-center-routing.module';
import { ControlCenterDashboardComponent } from './control-center-dashboard/control-center-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatDividerModule} from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    ControlCenterDashboardComponent
  ],
  imports: [
    CommonModule,
    MonitoringCenterRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTableModule,
    MatTabsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class MonitoringCenterModule { }
