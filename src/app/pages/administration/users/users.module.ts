import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { FormUserComponent } from './form-user/form-user.component';
import { GridUserComponent } from './grid-user/grid-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [FormUserComponent, GridUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSortModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
})
export class UsersModule { }
