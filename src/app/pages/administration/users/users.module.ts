import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { FormUserComponent } from './form-user/form-user.component';
import { GridUserComponent } from './grid-user/grid-user.component';
import { SharedModule } from 'app/shared/shared.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@NgModule({
  declarations: [FormUserComponent, GridUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'users' }],
})
export class UsersModule { }
