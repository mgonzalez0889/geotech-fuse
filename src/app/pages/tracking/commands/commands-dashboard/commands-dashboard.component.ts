/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandsService } from 'app/core/services/commands.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FleetsService } from 'app/core/services/fleets.service';
import { MobileService } from 'app/core/services/mobile.service';
import { DateAdapter, MatOption } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-commands-dashboard',
    templateUrl: './commands-dashboard.component.html',
    styleUrls: ['./commands-dashboard.component.scss'],
})
export class CommandsDashboardComponent implements OnInit {
    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDate();
    public dataCommandsSent: MatTableDataSource<any>;
    public send: number = 0;
    public expired: number = 0;
    public pending: number = 0;
    public searchPlate: any;
    public searchFleets: any;
    public validationFleet: number = 0;
    public allSelectedMobiles: boolean = false;
    public allSelectedFleets: boolean = false;
    public typeCommands: any;
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);
    public selectedPlates = [];
    public selectedTypeCommand: number;
    public selectedFleets = [];
    public mobiles: any = [];
    public fleets: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public columnsCommands: string[] = [
        'plate',
        'date_sent',
        'type_command',
        'user',
        'state',
        'resend',
    ];

    constructor(
        private commandsService: CommandsService,
        private mobilesService: MobileService,
        private fleetService: FleetsService,
        private dateAdapter: DateAdapter<any>,
        private snackBar: MatSnackBar
    ) {
        this.dateAdapter.setLocale('es');
    }

    ngOnInit(): void {
        this.getTypeCommand();
        this.getSentCommands();
        this.getFleets();
        this.getMobiles();
        setInterval(() => {
            this.getSentCommands();
        }, 50000);
    }

    /**
     * @description: Muestra los tipos de comandos
     */
    private getTypeCommand(): void {
        this.commandsService.getTypeCommands().subscribe((data) => {
            this.typeCommands = data.data;
        });
    }
    /**
     * @description: Obtiene los comandos enviados
     */
    public getSentCommands(): void {
        const date = {
            dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
            dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
        };
        this.commandsService.postSearchCommandsSend(date).subscribe((data) => {
            if (data.data_count) {
                this.send = data.data_count[1]?.count_state;
                this.expired = data.data_count[2]?.count_state;
                this.pending = data.data_count[0]?.count_state;
            } else {
                this.send = 0;
                this.expired = 0;
                this.pending = 0;
            }
            this.dataCommandsSent = new MatTableDataSource(data.data);
            this.dataCommandsSent.paginator = this.paginator;
            this.dataCommandsSent.sort = this.sort;
        });
    }
    /**
     * @description: Obtiene los vehiculos del cliente
     */
    private getMobiles(): void {
        this.mobilesService.getMobiles().subscribe((data) => {
            this.mobiles = data.data.map((x) => {
                x['selected'] = false;
                return x;
            });
            console.log(this.mobiles, 'this.mobiles');
        });
    }
    /**
     * @description: Obtiene las flotas del cliente
     */
    private getFleets(): void {
        this.fleetService.getFleets().subscribe((data) => {
            this.fleets = data.data.map((x) => {
                x['selected'] = false;
                return x;
            });
            console.log(data.data, ' estos son las flotas');
        });
    }

    filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataCommandsSent.filter = filterValue.trim().toLowerCase();
    }

    public resendCommand(plate: any, typeCommand: number): void {
        const commands = {
            validationFleet: this.validationFleet,
            fleets: this.selectedFleets,
            plates: [plate],
            command: typeCommand,
        };
        this.sendCommandsToDevice(commands);
    }

    public sentCommands(): void {
        this.selectedPlates = [];
        this.selectedFleets = [];
        this.mobiles.forEach((x) => {
            if (x.selected) {
                this.selectedPlates.push(x.plate);
            }
        });
        this.fleets.forEach((x) => {
            if (x.selected) {
                this.selectedFleets.push(x.id);
            }
        });
        const commands = {
            validationFleet: this.validationFleet,
            fleets: this.selectedFleets,
            plates: this.selectedPlates,
            command: this.selectedTypeCommand,
        };
        this.sendCommandsToDevice(commands);
    }

    private sendCommandsToDevice(commands: any): void {
        if (commands.fleets.length || commands.plates.length) {
            this.commandsService
                .postCommandsSend(commands)
                .subscribe((data) => {
                    if (data.code !== 200) {
                        this.snackBar.open(
                            'El comando no pudo ser enviado, intente nuevamente.',
                            'CERRAR',
                            { duration: 4000 }
                        );
                    }
                    this.getSentCommands();
                });
        } else {
            this.snackBar.open(
                'Favor seleccione un Vehículo o una flota.',
                'CERRAR',
                { duration: 4000 }
            );
        }
    }
    public typeOfSelection(event: any): void {
        this.validationFleet = event.index;
    }

    setAll(completed: boolean, type: string): any {
        if (type === 'mobiles') {
            this.allSelectedMobiles = completed;
            if (this.mobiles == null) {
                return;
            }
            this.mobiles.forEach((x) => {
                x.selected = completed;
                console.log(x, 'x');
            });
        } else if ('fleets') {
            this.allSelectedFleets = completed;
            if (this.fleets == null) {
                return;
            }
            this.fleets.forEach((t) => (t.selected = completed));
        }
    }

    someComplete(type: string): boolean {
        if (type === 'mobiles') {
            if (this.mobiles == null) {
                return false;
            }
            return (
                this.mobiles.filter((t) => t.selected).length > 0 &&
                !this.allSelectedMobiles
            );
        } else if ('fleets') {
            if (this.fleets == null) {
                return false;
            }
            return (
                this.fleets.filter((t) => t.selected).length > 0 &&
                !this.allSelectedFleets
            );
        }
    }
}
