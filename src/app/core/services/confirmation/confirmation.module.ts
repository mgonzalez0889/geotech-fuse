import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationService } from './confirmation.service';

@NgModule({
    declarations: [DialogComponent],
    imports: [MatButtonModule, MatDialogModule, MatIconModule, CommonModule],
    providers: [ConfirmationService],
})
export class ConfirmationModule {
    /**
     * Constructor
     */
    constructor(private confirmationService: ConfirmationService) {}
}
