import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerEngagementRoutingModule } from './customer-engagement-routing.module';
import { FormLinkageComponent } from './form-linkage/form-linkage.component';
import { GridLinkageComponent } from './grid-linkage/grid-linkage.component';
import { UsersRoutingModule } from '@pages/administration/users/users-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'app/shared/shared.module';
import { ComponentsModule } from 'app/shared/components/components.module';


@NgModule({
  declarations: [
    FormLinkageComponent,
    GridLinkageComponent,
  ],
  imports: [
    CommonModule,
    CustomerEngagementRoutingModule,
    ComponentsModule,
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
    MatOptionModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SharedModule

  ]
})
export class CustomerEngagementModule { }
