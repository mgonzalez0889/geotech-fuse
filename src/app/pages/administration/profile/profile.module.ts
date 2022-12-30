import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { GridProfileComponent } from './grid-profile/grid-profile.component';
import { FormProfileComponent } from './form-profile/form-profile.component';
import { SharedModule } from 'app/shared/shared.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@NgModule({
  declarations: [
    GridProfileComponent,
    FormProfileComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'profile' }],
})
export class ProfileModule { }
