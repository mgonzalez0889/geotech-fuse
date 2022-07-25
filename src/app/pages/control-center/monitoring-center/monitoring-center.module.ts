import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringCenterRoutingModule } from './monitoring-center-routing.module';
import { ControlCenterDashboardComponent } from './control-center-dashboard/control-center-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ControlCenterActionsComponent } from './control-center-actions/control-center-actions.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [
        ControlCenterDashboardComponent,
        ControlCenterActionsComponent,
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
        MatSelectModule,
        MatListModule,
        MatPaginatorModule,
        MatSortModule,
        MatDatepickerModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
    ],
})
export class MonitoringCenterModule {}
