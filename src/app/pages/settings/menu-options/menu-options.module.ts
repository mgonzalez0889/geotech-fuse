import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuOptionsRoutingModule } from './menu-options-routing.module';
import { FormMenuOptionsComponent } from './form-menu-options/form-menu-options.component';
import { GridMenuOptionsComponent } from './grid-menu-options/grid-menu-options.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [FormMenuOptionsComponent, GridMenuOptionsComponent],
    imports: [
        CommonModule,
        MenuOptionsRoutingModule,
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
        MatProgressSpinnerModule,
    ],
})
export class MenuOptionsModule {}
