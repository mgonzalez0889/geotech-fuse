import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlateOptionsRoutingModule } from './plate-options-routing.module';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
  declarations: [

  ],
    imports: [
        CommonModule,
        PlateOptionsRoutingModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatSelectModule
    ]
})
export class PlateOptionsModule { }
