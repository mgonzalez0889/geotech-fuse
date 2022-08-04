import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandsDashboardComponent } from './commands-dashboard/commands-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: CommandsDashboardComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommandsRoutingModule { }
