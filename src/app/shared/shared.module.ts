import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentsModule } from './components/components.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslocoModule } from '@ngneat/transloco';
import { MatOptionModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    ComponentsModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    MatAutocompleteModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    TranslocoModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDividerModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSortModule,
    MatInputModule,
    MatExpansionModule,
    DragDropModule,
    CdkAccordionModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatAutocompleteModule,
    FuseDrawerModule
  ],
})
export class SharedModule { }
