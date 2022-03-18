import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent} from "ng-apexcharts";
import {MatDialog} from "@angular/material/dialog";
import {FormMaintenanceComponent} from "../form-maintenance/form-maintenance.component";
import {MobileService} from "../../../../core/services/mobile.service";
import {Observable} from "rxjs";
import {Browser} from "leaflet";
import mobile = Browser.mobile;

const ELEMENT_DATA: any[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};

export interface State {
    id: number;
    state: string;
    style: string;
}


@Component({
    selector: 'app-grid-maintenance',
    templateUrl: './grid-maintenance.component.html',
    styleUrls: ['./grid-maintenance.component.scss']
})
export class GridMaintenanceComponent implements OnInit {
    public dataSource: MatTableDataSource<any> = new MatTableDataSource(ELEMENT_DATA);
    public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    @ViewChild('chart') chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    public mobiles = [];
    public mobileList;


    constructor(
        private _matDialog: MatDialog,
        private _mobilesService: MobileService
    ) {
        this.chartOptions = {
            series: [44, 55, 13, 43, 22],
            chart: {
                type: 'donut'
            },
            labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ]
        };
    }

    ngOnInit(): void {
        this.getMobiles();
    }


    /**
     * @description: Informacion de lista desplegable de estados
     */
    states: State[] = [
        {
            id: 1,
            state: 'Programado',
            style: 'text-white-600'
        },
        {
            id: 2,
            state: 'Terminado',
            style: 'text-green-600'
        },
        {
            id: 3,
            state: 'Expirado',
            style: 'text-red-600'
        },
        {
            id: 4,
            state: 'Pendiente',
            style: 'text-orange-600'
        },
    ];

    /**
     * @description: Abre el formulario para la creacion de mantenimientos
     */
    public openForm(): void {
        const dialofRef = this._matDialog.open(FormMaintenanceComponent, {
            minWidth: '70%',
            minHeight: '85%',
        });
        dialofRef.afterClosed().toPromise();
    }

    /**
     * @description: Obtiene un listado de los vehiculos del cliente
     */
    private getMobiles(): void {
        this._mobilesService.getMobiles().subscribe(({data}) => {
            data.forEach((x) => {
                this.mobiles.push(x.plate);
            });
            this.mobileList = this.mobiles;
        });
    }

    /**
     * @description: Recibe el valor escrito en el buscador
     */
    public keyword(value): void {
        this.mobileList = this.searchMobile(value);
    }

    /**
     * @description: Realiza el filtro
     */
    private searchMobile(value: string) {
        const filter = value.toLowerCase();
        return this.mobiles.filter(option =>
            option.toLowerCase().includes(filter)
        );
    }
}
