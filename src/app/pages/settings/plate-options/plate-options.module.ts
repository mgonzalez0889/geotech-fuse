import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlateOptionsRoutingModule } from './plate-options-routing.module';
import { GridPlateOptionComponent } from './grid-plate-option/grid-plate-option.component';
import { FormPlateOptionComponent } from './form-plate-option/form-plate-option.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    GridPlateOptionComponent,
    FormPlateOptionComponent
  ],
    imports: [
        CommonModule,
        PlateOptionsRoutingModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule
    ]
})
export class PlateOptionsModule { }
