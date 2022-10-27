/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DispatchService } from 'app/core/services/dispatch.service';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grid-dispatch',
  templateUrl: './grid-dispatch.component.html',
  styleUrls: ['./grid-dispatch.component.scss'],
})
export class GridDispatchComponent implements OnInit, OnDestroy {
  public dispatch_cout: number = 0;
  public pre_dispatch_count: number = 0;
  public finished_cout: number = 0;
  public dispatch: any = [];
  public infoDispatch: any = [];
  public today = new Date();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
  public day = this.today.getDate();
  public initialDate: Date = new Date(this.year, this.month, this.day);
  public finalDate: Date = new Date(this.year, this.month, this.day);
  public subscription: Subscription;
  public opened: boolean = false;
  public dataTableDispatch: MatTableDataSource<any>;
  public dispatchCount: number = 0;
  public columnsDispatch: string[] = [
    'id',
    'spreadsheet',
    'status',
    'created_at',
    'date_init_dispatch',
    'date_end_dispatch',
    'plate',
    'device',
    'container_number',
    'security_seal',
    'init_place',
    'end_place',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dispatchService: DispatchService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    this.getDispatch();
    this.listenObservables();
  }
  /**
   * @description: Trae todos los despachos del cliente
   */
  public getDispatch(): void {
    const data = {
      dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
      dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
      status: [0, 1, 2],
    };
    this.dispatchService.getDispatches(data).subscribe((res) => {
      this.infoDispatch = res.data;
      if (res.count_dispatches) {
        this.dispatch_cout = res.count_dispatches[1]?.count_status;
        this.pre_dispatch_count = res.count_dispatches[0]?.count_status;
        this.finished_cout = res.count_dispatches[2]?.count_status;
      } else {
        this.dispatch_cout = 0;
        this.pre_dispatch_count = 0;
        this.finished_cout = 0;
      }
      if (res.data) {
        res.dispatch = res.data;
        this.dispatchCount = res.data.length;
      } else {
        this.dispatchCount = 0;
      }
      this.dataTableDispatch = new MatTableDataSource(res.data);
      this.dataTableDispatch.paginator = this.paginator;
      this.dataTableDispatch.sort = this.sort;
    });
  }
  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTableDispatch.filter = filterValue.trim().toLowerCase();
  }
  /**
   * @description: Guarda el ID del despacho para aburirlo en el formulario
   */
  public actionsDispatch(id: number): void {
    this.opened = true;
    this.dispatchService.behaviorSubjectDispatchForm.next({
      id: id,
      isEdit: false,
    });
  }
  /**
   * @description: Crear un nuevo despacho
   */
  public newDispatch(): void {
    this.opened = true;
    this.dispatchService.behaviorSubjectDispatchForm.next({
      newDispatch: 'Nuevo despacho',
    });
  }
  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
    this.subscription =
      this.dispatchService.behaviorSubjectDispatchGrid.subscribe(
        ({ reload, opened }) => {
          this.opened = opened;
          if (reload) {
            this.getDispatch();
          }
        }
      );
  }
  public downloadDispatch(typeFormat: string): any {
    const exportData = this.infoDispatch.map((row: any) => ({
      'Numero de viaje': row.id,
      Planilla: row.spreadsheet,
      'Número de declaración': row.declaration_number,
      Cliente: row.client,
      Origen: row.init_place,
      Destino: row.end_place,
      Placa: row.plate,
      Conductor: row.name,
      Identificación: row.identification,
      Contacto: row.phone,
      Dispositivo: row.device_description,
      'Sello de seguridad': row.security_seal,
      'Numero de contenedor': row.container_number,
      Observaciones: row.detail,
    }));
    this.exportReportData(exportData, typeFormat);
  }
  private exportReportData(exportData: any, typeFormat: any): void {
    switch (typeFormat) {
      case 'CSV':
        let values;
        const csv: any = [];
        const csvTemp = [];
        const headers = Object.keys(exportData[0]);
        console.log('exportData[0]', exportData[0]);

        console.log('headers', headers);


        csvTemp.push(headers.join(','));
        console.log('csvTemp', csvTemp);

        for (const row of exportData) {
          values = headers.map((header: any) => row[header]);
          csvTemp.push(values.join(','));
        }
        csv.push(csvTemp.join('\n'));
        console.log('csv', csv);

        const blob = new Blob([csv], { type: 'text/csv' });
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.setAttribute('hidden', '');
        // a.setAttribute('href', url);
        // a.setAttribute('download', 'Report.csv');
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
        break;
      case 'EXCEL':
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, 'ReportDispatch.xlsx');
        break;
    }
  }
}
