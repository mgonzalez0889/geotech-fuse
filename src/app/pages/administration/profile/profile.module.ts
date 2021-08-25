import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { GridProfileComponent } from './grid-profile/grid-profile.component';
import { FormProfileComponent } from './form-profile/form-profile.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {CdkScrollableModule} from "@angular/cdk/scrolling";
import {MatTabsModule} from "@angular/material/tabs";
import { GridOptionProfileComponent } from './grid-option-profile/grid-option-profile.component';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { GridUserOptionProfileComponent } from './grid-user-option-profile/grid-user-option-profile.component';
import {MatSelectModule} from "@angular/material/select";
import {GridPlateOptionComponent} from "./grid-plate-option/grid-plate-option.component";
import {FormPlateOptionComponent} from "./form-plate-option/form-plate-option.component";
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [

    GridProfileComponent,
       FormProfileComponent,
       GridOptionProfileComponent,
       GridUserOptionProfileComponent,
       GridPlateOptionComponent,
       FormPlateOptionComponent
  ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        CdkScrollableModule,
        MatTabsModule,
        MatTableModule,
        MatCheckboxModule,
        MatSelectModule,
        FormsModule,
        MatPaginatorModule
    ]
})
export class ProfileModule { }
