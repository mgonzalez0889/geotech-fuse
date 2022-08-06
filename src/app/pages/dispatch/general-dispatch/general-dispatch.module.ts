import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralDispatchRoutingModule } from './general-dispatch-routing.module';
import { FormDispatchComponent } from './form-dispatch/form-dispatch.component';
import { GridDispatchComponent } from './grid-dispatch/grid-dispatch.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { StartDispatchComponent } from './start-dispatch/start-dispatch.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        FormDispatchComponent,
        GridDispatchComponent,
        StartDispatchComponent,
    ],
    imports: [
        CommonModule,
        GeneralDispatchRoutingModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatDividerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatPaginatorModule,
        MatTableModule,
        MatDatepickerModule,
        FormsModule,
        MatDialogModule,
    ],
})
export class GeneralDispatchModule {}
