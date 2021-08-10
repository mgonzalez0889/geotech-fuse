import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { GridProfileComponent } from './grid-profile/grid-profile.component';
import { FormProfileComponent } from './form-profile/form-profile.component';


@NgModule({
  declarations: [
  
    GridProfileComponent,
       FormProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
