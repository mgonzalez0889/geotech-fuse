import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAlert, IOptionTable } from '@interface/index';
import { AlertService } from '@services/api/alert.service';

@Component({
  selector: 'app-grid-alert',
  templateUrl: './grid-alert.component.html',
  styleUrls: ['./grid-alert.component.scss']
})
export class GridAlertComponent implements OnInit, OnDestroy {
  public openedDrawer = false;
  public titlePage: string = 'Mis alertas';
  public subTitlepage: string = '';
  public alertData: IAlert[] = [];
  public dataFilter: string = '';
  public optionsTabla: IOptionTable[] = [
    {
      name: 'colorText',
      text: 'Color',
      typeField: 'text',
      classTailwind: 'w-6 h-6 rounded-full',
      color: (data): string => {
        data['colorText'] = '';
        return data.color;
      }
    },
    {
      name: 'event_name',
      text: 'Nombre',
      typeField: 'text'
    },
    {
      name: 'description',
      text: 'Descripción',
      typeField: 'text'
    },
    {
      name: 'state',
      text: 'Estado',
      typeField: 'switch'
    }
  ];
  public columnsTable = this.optionsTabla.map(({ name }) => name);
  private unsubscribe$ = new Subject<void>();

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.getAlerts().toPromise();
    this.alertService.selectState(state => state.alerts)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((alerts) => {
        this.subTitlepage = alerts.length ? `${alerts.length} alertas` : 'No hay alertas';
        this.alertData = [...alerts];
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: Funcion del filtro en la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

}
