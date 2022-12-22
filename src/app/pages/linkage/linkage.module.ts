import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinkageRoutingModule } from './linkage-routing.module';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LinkageRoutingModule,
    SharedModule
  ]
})
export class LinkageModule { }
