import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsControlCenterRoutingModule } from './contacts-control-center-routing.module';
import { FormContactComponent } from './form-contact/form-contact.component';
import { GridContactComponent } from './grid-contact/grid-contact.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    declarations: [FormContactComponent, GridContactComponent],
    imports: [
        CommonModule,
        ContactsControlCenterRoutingModule,
        MatSidenavModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatInputModule,
        MatSelectModule,
        MatSortModule,
        MatMenuModule,
        SharedModule
    ],
    providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'controlCenter' }],

})
export class ContactsControlCenterModule {}
