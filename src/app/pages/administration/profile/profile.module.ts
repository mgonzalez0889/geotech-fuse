import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { GridProfileComponent } from './grid-profile/grid-profile.component';
import { FormProfileComponent } from './form-profile/form-profile.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {CdkScrollableModule} from "@angular/cdk/scrolling";
import {MatTabsModule} from "@angular/material/tabs";
import { GridOptionProfileComponent } from './grid-option-profile/grid-option-profile.component';
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";


@NgModule({
  declarations: [

    GridProfileComponent,
       FormProfileComponent,
       GridOptionProfileComponent
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
        MatCheckboxModule
    ]
})
export class ProfileModule { }
