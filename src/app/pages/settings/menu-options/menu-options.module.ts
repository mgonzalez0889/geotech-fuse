import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuOptionsRoutingModule } from './menu-options-routing.module';
import { FormMenuOptionsComponent } from './form-menu-options/form-menu-options.component';
import { GridMenuOptionsComponent } from './grid-menu-options/grid-menu-options.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    FormMenuOptionsComponent,
    GridMenuOptionsComponent
  ],
    imports: [
        CommonModule,
        MenuOptionsRoutingModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule
    ]
})
export class MenuOptionsModule { }
