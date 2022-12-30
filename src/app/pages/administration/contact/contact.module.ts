import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormContactComponent } from './form-contact/form-contact.component';
import { GridContactComponent } from './grid-contact/grid-contact.component';
import { ContactRoutingModule } from './contact-routing.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [FormContactComponent, GridContactComponent],
    imports: [
        CommonModule,
        ContactRoutingModule,
        SharedModule
    ],
    providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'contacts' }],

})
export class ContactModule {}
