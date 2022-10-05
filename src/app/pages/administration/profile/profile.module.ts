import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { GridProfileComponent } from './grid-profile/grid-profile.component';
import { FormPlateOptionComponent } from './form-plate-option/form-plate-option.component';
import { GridOptionProfileComponent } from './grid-option-profile/grid-option-profile.component';
import { GridUserOptionProfileComponent } from './grid-user-option-profile/grid-user-option-profile.component';
import { GridPlateOptionComponent } from './grid-plate-option/grid-plate-option.component';
import { FormProfileComponent } from './form-profile/form-profile.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';

@NgModule({
    declarations: [
        GridProfileComponent,
        FormProfileComponent,
        GridOptionProfileComponent,
        GridUserOptionProfileComponent,
        GridPlateOptionComponent,
        FormPlateOptionComponent,
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSortModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatDividerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatPaginatorModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        FuseFindByKeyPipeModule,

    ],
})
export class ProfileModule {}
