import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IConfirmationModal } from '../../../interfaces/services/confirmation-modal.interface';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styles: [
    /* language=SCSS */
    `
            .cconfirmation-dialog-panel {
                @screen md {
                    @apply w-128;
                }

                .mat-dialog-container {
                    padding: 0 !important;
                }
            }
        `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IConfirmationModal,
    public matDialogRef: MatDialogRef<DialogComponent>
  ) { }

  ngOnInit(): void { }
}
