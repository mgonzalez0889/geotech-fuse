import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MapComponent } from './map/map.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PanelMapMainComponent } from './panel-map-main/panel-map-main.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { _MatMenuDirectivesModule, MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseDateRangeModule } from '@fuse/components/date-range';
import { FuseDrawerModule } from '@fuse/components/drawer';

@NgModule({
  declarations: [
    MapComponent,
    PanelMapMainComponent,
  ],
  imports: [
    CommonModule,
    MapsRoutingModule,
    SharedModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatInputModule,
  ],

})
export class MapsModule { }
