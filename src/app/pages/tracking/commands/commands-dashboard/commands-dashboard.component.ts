/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandsService } from 'app/core/services/commands.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FleetsService } from 'app/core/services/fleets.service';
import { MobileService } from 'app/core/services/mobile.service';
import { map, filter } from 'rxjs/operators';
export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}

@Component({
    selector: 'app-commands-dashboard',
    templateUrl: './commands-dashboard.component.html',
    styleUrls: ['./commands-dashboard.component.scss'],
})
export class CommandsDashboardComponent implements OnInit {
    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDay();
    public dataCommandsSent: MatTableDataSource<any>;
    public send: number = 0;
    public expired: number = 0;
    public pending: number = 0;

    public selectedFleets2;
    public typeCommands: any;
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);
    public selectedPlates: [] = [];
    public selectedTypeCommand: number;
    public selectedFleets: [] = [];
    public mobiles: any = [];
    public fleets: any = [];
    public columnsCommands: string[] = [
        'plate',
        'date_sent',
        'type_command',
        'user',
        'state',
        'resend',
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private commandsService: CommandsService,
        private mobilesService: MobileService,
        private fleetService: FleetsService
    ) {}

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
            date_init: this.initialDate,
            date_end: this.finalDate,
        };
        this.commandsService.postCommandsSend(date).subscribe((data) => {
            if (data.data_count) {
                this.send = data.data_count[0]?.count_state;
                this.expired = data.data_count[1]?.count_state;
                this.pending = data.data_count[2]?.count_state;
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
        console.log(filterValue.trim().toLowerCase(), 'filterValue');
        this.dataCommandsSent.filter = filterValue.trim().toLowerCase();
    }
    filterfleet(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue, 'filterValue');
    }
}
