import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerEngagementModule } from './customer-engagement.module';
import { GridLinkageComponent } from './grid-linkage/grid-linkage.component';

const routes: Routes = [
  {
    path: '',
    component: GridLinkageComponent,
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerEngagementRoutingModule { }
