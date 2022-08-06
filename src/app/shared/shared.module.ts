import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import { ConfirmDeleteComponent } from './dialogs/confirm-delete/confirm-delete.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatSnackBarModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
    ],
    exports: [CommonModule, FormsModule, ReactiveFormsModule],
    declarations: [MessageDialogComponent, ConfirmDeleteComponent],
})
export class SharedModule {}
