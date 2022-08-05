import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalContactsComponent } from 'app/pages/control-center/monitoring-center/modal-contacts/modal-contacts.component';

@Component({
    selector: 'app-start-dispatch',
    templateUrl: './start-dispatch.component.html',
    styleUrls: ['./start-dispatch.component.scss'],
})
export class StartDispatchComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<StartDispatchComponent>,
        @Inject(MAT_DIALOG_DATA) public startDispath
    ) {}

    ngOnInit(): void {}
}
