import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAlert, IOptionTable } from '@interface/index';
import { AlertService } from '@services/api/alert.service';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-grid-alert',
  templateUrl: './grid-alert.component.html',
  styleUrls: ['./grid-alert.component.scss']
})
export class GridAlertComponent implements OnInit, OnDestroy {
  public openedDrawer = false;
  public alertData: IAlert[] = [];
  public dataFilter: string = '';
  public optionsTabla: IOptionTable[] = [
    {
      name: 'colorText',
      text: 'alerts.tablePage.color',
      typeField: 'text',
      classTailwind: 'w-6 h-6 rounded-full',
      color: (data): string => {
        data['colorText'] = '';
        return data.color;
      }
    },
    {
      name: 'alert_name',
      text: 'alerts.tablePage.name',
      typeField: 'text'
    },
    {
      name: 'description',
      text: 'alerts.tablePage.description',
      typeField: 'text'
    },
    {
      name: 'status_alert',
      text: 'alerts.tablePage.state',
      typeField: 'switch'
    }
  ];
  public columnsTable = this.optionsTabla.map(({ name }) => name);
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _alertService: AlertService,
    private _toastAlert: ToastAlertService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this._alertService.getAlerts().subscribe({
      next: () => { },
      error: ({ error }) => {
        this._toastAlert.toasAlertWarn({
          message: `${error.error}`
        });
      }
    });

    this._alertService.selectState(state => state.alerts)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((alerts) => {
        this.alertData = [...alerts];
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  actiosAlert(dataAlert: { action: string; data: any }): void {
    if (dataAlert.action === 'add') {
      this._alertService.createAlerts(dataAlert.data)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          {
            next: ({ data }) => {
              this._toastAlert.toasAlertSuccess({
                message: `Alert ${data.alert_name} creada con exito.`
              });
              this.openedDrawer = false;
            },
            error: ({ error }) => {
              this._toastAlert.toasAlertWarn({
                message: `${error.error}`
              });
              this.openedDrawer = false;
            }
          }
        );
    }
  }

  public changeStatusAlert(dataSwich: { state: boolean; data: any }): void {
    this._alertService.changeStatusAlert(dataSwich.data.id, dataSwich.state)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this._toastAlert.toasAlertSuccess({
            message: 'Estado de la alerta modificado con exito.'
          });
        },
        error: (err) => {
          this._toastAlert.toasAlertWarn({
            message: `${err.error || err}`
          });
        }
      });
  }

  /**
   * @description: Funcion del filtro en la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

}
