import { Injectable, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    public dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
      'ver_detalle'
  ];

    constructor() {}
}
