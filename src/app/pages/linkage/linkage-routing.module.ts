import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {

    path: '',
    children: [
      {
        path: 'customer-engagement',
        loadChildren: (): Promise<any> =>
          import('./customer-engagement/customer-engagement.module').then(
            m => m.CustomerEngagementModule
          ),
      },
    ],
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkageRoutingModule { }
