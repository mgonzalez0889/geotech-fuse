import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommandsRoutingModule } from './commands-routing.module';
import { CommandsDashboardComponent } from './commands-dashboard/commands-dashboard.component';
import { SharedModule } from '../../../shared/shared.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormCommandsComponent } from './form-commands/form-commands.component';

@NgModule({
  declarations: [
    CommandsDashboardComponent,
    FormCommandsComponent,
  ],
  imports: [
    CommonModule,
    CommandsRoutingModule,
    SharedModule
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'commands' }],

})
export class CommandsModule { }
