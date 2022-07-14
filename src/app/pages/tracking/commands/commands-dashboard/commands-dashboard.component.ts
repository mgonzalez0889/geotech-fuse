/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandsService } from 'app/core/services/commands.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FleetsService } from 'app/core/services/fleets.service';
import { MobileService } from 'app/core/services/mobile.service';
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
    public typeCommands: any;
    public dataCommandsSent: MatTableDataSource<any>;
    public dataMobile: MatTableDataSource<any>;
    public dataFleet: MatTableDataSource<any>;
    public columnsCommands: string[] = [
        'plate',
        'date_sent',
        'type_command',
        'user',
        'state',
        'resend',
    ];
    public columnsMobile: string[] = ['select', 'plate'];
    public columnsFleet: string[] = [
        'plate',
        'date_sent',
        'type_command',
        'user',
        'state',
        'resend',
    ];
    @ViewChild('tableCommandsSent', { static: true })
    tableCommandsSent: MatPaginator;
    @ViewChild('tableMobile', { static: true }) tableMobile: MatPaginator;
    @ViewChild('tableFleet', { static: true }) tableFleet: MatPaginator;
    @ViewChild('sortMobile') sortMobile: MatSort;
    @ViewChild('sortFleet') sortFleet: MatSort;
    @ViewChild('sortCommandsSent') sortCommandsSent: MatSort;

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
    private getSentCommands(): void {
        const data = {
            date_init: '2022-06-01T05:00:00.000Z',
            date_end: '2022-07-21T05:00:00.000Z',
        };
        this.commandsService.postCommandsSend(data).subscribe((x) => {
            this.dataCommandsSent = new MatTableDataSource(x.data);
            this.dataCommandsSent.paginator = this.tableCommandsSent;
            this.dataCommandsSent.sort = this.sortCommandsSent;
        });
    }
    /**
     * @description: Obtiene los vehiculos del cliente
     */
    private getMobiles(): void {
        this.mobilesService.getMobiles().subscribe((data) => {
            this.dataMobile = new MatTableDataSource(data.data);
            this.dataMobile.paginator = this.tableMobile;
            this.dataMobile.sort = this.sortMobile;
            console.log(data.data, ' estos son las placas');
        });
    }
    /**
     * @description: Obtiene las flotas del cliente
     */
    private getFleets(): void {
        this.fleetService.getFleets().subscribe((data) => {
            console.log(data.data, ' estos son las flotas');
        });
    }

    task: Task = {
        name: 'Indeterminate',
        completed: false,
        subtasks: [
            { name: 'Primary', completed: false },
            { name: 'Accent', completed: false },
            { name: 'Warn', completed: false },
        ],
    };

    allComplete: boolean = true;

    updateAllComplete() {
        this.allComplete =
            this.task.subtasks != null &&
            this.task.subtasks.every((t) => t.completed);
    }

    someComplete(): boolean {
        console.log('someComplete');

        if (this.task.subtasks == null) {
            return false;
        }
        return (
            this.task.subtasks.filter((t) => t.completed).length > 0 && !this.allComplete
        );
    }

    setAll(completed: boolean) {
        console.log('setAll',completed);
        this.allComplete = completed;
        if (this.task.subtasks == null) {
            return;
        }
        this.task.subtasks.forEach((t) => (t.completed = completed));
    }
}
