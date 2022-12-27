import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommandsRoutingModule } from './commands-routing.module';
import { CommandsDashboardComponent } from './commands-dashboard/commands-dashboard.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { PipeFilterPipe } from 'app/pages/tracking/commands/commands-dashboard/filter-fleet.pipe';
import { PipeFilterPlatePipe } from 'app/pages/tracking/commands/commands-dashboard/filter-plate.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../../../shared/shared.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormCommandsComponent } from './form-commands/form-commands.component';

@NgModule({
  declarations: [
    CommandsDashboardComponent,
    PipeFilterPipe,
    PipeFilterPlatePipe,
    FormCommandsComponent,
  ],
  imports: [
    CommonModule,
    CommandsRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatListModule,
    FormsModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'commands' }],

})
export class CommandsModule { }
