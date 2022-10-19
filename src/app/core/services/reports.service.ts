import { Injectable, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    public dataSource: MatTableDataSource<any>;
    data: any;
    trips: any[] = [];
    public displayedColumns: string[] = [
        'plate',
        'fecha_inicial',
        'direccion_inicial',
        'fecha_final',
        'direccion_final',
        'viajes',
        'tiempo',
        'paradas',
        'paradas_tiempo',
        'ver_detalle',
    ];

    constructor() {}
}
