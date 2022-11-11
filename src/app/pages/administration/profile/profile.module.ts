import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { GridProfileComponent } from './grid-profile/grid-profile.component';
import { FormProfileComponent } from './form-profile/form-profile.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@NgModule({
  declarations: [
    GridProfileComponent,
    FormProfileComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatInputModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatCheckboxModule,
    MatStepperModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    DragDropModule,
    MatExpansionModule,
    CdkAccordionModule
  ],
})
export class ProfileModule { }
