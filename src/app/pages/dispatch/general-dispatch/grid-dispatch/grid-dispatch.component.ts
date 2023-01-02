import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IOptionTable } from 'app/core/interfaces';
import { DispatchService } from 'app/core/services/api/dispatch.service';
import { DowloadTools } from 'app/core/tools/dowload.tool';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { TranslocoService } from '@ngneat/transloco';
import moment from 'moment';

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
  public initialDate: Date = new Date();
  public finalDate: Date = new Date();
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
      text: 'dispatch.tablePage.num',
      typeField: 'text'
    },
    {
      name: 'spreadsheet',
      text: 'dispatch.tablePage.spreadsheet',
      typeField: 'text',
    },
    {
      name: 'created_at',
      text: 'dispatch.tablePage.dateCreate',
      typeField: 'date'
    },
    {
      name: 'date_init_dispatch',
      text: 'dispatch.tablePage.dateInitDispatch',
      typeField: 'date'
    },
    {
      name: 'date_end_dispatch',
      text: 'dispatch.tablePage.dateEndDispatch',
      typeField: 'date',
    },
    {
      name: 'plate',
      text: 'dispatch.tablePage.vehicle',
      typeField: 'text',
    },
    {
      name: 'device',
      text: 'dispatch.tablePage.device',
      typeField: 'text',
    },
    {
      name: 'container_number',
      text: 'dispatch.tablePage.container',
      typeField: 'text'
    },
    {
      name: 'security_seal',
      text: 'dispatch.tablePage.securitySeal',
      typeField: 'text'
    },
    {
      name: 'init_place',
      text: 'dispatch.tablePage.origin',
      typeField: 'text'
    },
    {
      name: 'end_place',
      text: 'dispatch.tablePage.destination',
      typeField: 'text'
    },
  ];
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    addDispatch: 'despachos:despachos:create',
    updateDispatch: 'despachos:despachos:update',
    deleteDispatch: 'despachos:despachos:delete',
  };

  constructor(
    private dowloadTools: DowloadTools,
    private dispatchService: DispatchService,
    private dateAdapter: DateAdapter<any>,
    private authService: AuthService,
    private toastAlert: ToastAlertService,
    private translocoService: TranslocoService
  ) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    this.getDispatch();
    this.listenObservables();
    this.authService.permissionList.subscribe((permission) => {
      this.listPermission = permission;
    });
  }

  /**
   * @description: Trae todos los despachos del cliente
   */
  public getDispatch(): void {
    const data = {
      dateInit: moment(this.initialDate).format('DD/MM/YYYY') + ' 00:00:00',
      dateEnd: moment(this.finalDate).format('DD/MM/YYYY') + ' 00:00:00',
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
    if (!this.listPermission[this.permissionValid.addDispatch]) {
      this.toastAlert.toasAlertWarn({
        message: this.translocoService.translate('messageAlert.messagePermissionWarn'),

      });
    } else {
      this.opened = true;
      this.dispatchService.behaviorSubjectDispatchForm.next({
        newDispatch: 'Nuevo despacho',
      });
    }
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
