import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { FormDriverComponent } from './form-driver/form-driver.component';
import { GridDriverComponent } from './grid-driver/grid-driver.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [FormDriverComponent, GridDriverComponent],
    imports: [
        CommonModule,
        DriverRoutingModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatPaginatorModule,
        MatTableModule,
        MatDatepickerModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        SharedModule
    ],
    providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'driver' }],
})
export class DriverModule {}
