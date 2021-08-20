import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileOptionRoutingModule } from './profile-option-routing.module';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [

  ],
    imports: [
        CommonModule,
        ProfileOptionRoutingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule
    ]
})
export class ProfileOptionModule { }
