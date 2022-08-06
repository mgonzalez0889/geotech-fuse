/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DispatchService } from 'app/core/services/dispatch.service';

@Component({
    selector: 'app-start-dispatch',
    templateUrl: './start-dispatch.component.html',
    styleUrls: ['./start-dispatch.component.scss'],
})
export class StartDispatchComponent implements OnInit {
    public devices: any = [];
    public plate: number;
    public security_seal: any;
    constructor(
        public dialogRef: MatDialogRef<StartDispatchComponent>,
        @Inject(MAT_DIALOG_DATA) public startDispatch,
        private dispatchService: DispatchService
    ) {}

    ngOnInit(): void {
        this.getDevicesDispatch();
    }
    /**
     * @description: Asocia el dispositivo al despacho
     */
    public associateDevice(): void {
        const data = {
            id: this.startDispatch.id,
            device: this.plate,
            security_seal: this.security_seal,
        };
        this.dispatchService.putDispatch(data).subscribe((res) => {
            if (res.code === 200) {
                this.dispatchService.behaviorSubjectDispatchGrid.next({
                    reload: true,
                    opened: false,
                });
            }
        });
    }
    /**
     * @description: Buscar los dispositivos aptos para crear un despacho
     */
    private getDevicesDispatch(): void {
        this.dispatchService.getDevicesDispatch().subscribe((res) => {
            console.log(res.data);
            this.devices = res.data;
        });
    }
}
