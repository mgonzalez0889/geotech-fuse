/* eslint-disable @typescript-eslint/naming-convention */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IOptionTable } from 'app/core/interfaces';
import { DispatchService } from 'app/core/services/dispatch.service';
import { DowloadTools } from 'app/core/tools/dowload.tool';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grid-dispatch',
  templateUrl: './grid-dispatch.component.html',
  styleUrls: ['./grid-dispatch.component.scss'],
})
export class GridDispatchComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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

  public optionsTable: IOptionTable[] = [
    {
      name: 'id',
      text: 'No.',
      typeField: 'text'
    },
    {
      name: 'spreadsheet',
      text: 'Planilla',
      typeField: 'text',
    },
    {
      name: 'created_at',
      text: 'Fecha de creacion',
      typeField: 'date'
    },
    {
      name: 'date_init_dispatch',
      text: 'Fecha de inicio de despacho',
      typeField: 'date'
    },
    {
      name: 'date_end_dispatch',
      text: 'Fecha de finalización del despacho',
      typeField: 'date',
    },
    {
      name: 'plate',
      text: 'Vehiculo',
      typeField: 'text',
    },
    {

      name: 'device',
      text: 'Dispositivo',
      typeField: 'text',
    },
    {
      name: 'container_number',
      text: 'Contenedor',
      typeField: 'text'
    },
    {
      name: 'security_seal',
      text: 'Sello de seguridad',
      typeField: 'text'
    },
    {
      name: 'init_place',
      text: 'Origen',
      typeField: 'text'
    },
    {
      name: 'end_place',
      text: 'Destino',
      typeField: 'text'
    },
  ];


  constructor(
    private dowloadTools: DowloadTools,
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
      this.infoDispatch = res.data || [];

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

  public downloadDispatch(typeFormat: 'csv' | 'excel'): any {
    switch (typeFormat) {
      case 'csv':
        this.dowloadTools.dowloadCsv(this.optionsTable, this.infoDispatch, 'dispach-report');
        break;
      case 'excel':
        this.dowloadTools.dowloadExcel(this.optionsTable, this.infoDispatch, 'dispach-report');
        break;
    }
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


}
