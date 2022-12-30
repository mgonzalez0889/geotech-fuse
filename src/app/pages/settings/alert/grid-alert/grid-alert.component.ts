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
  public titlePage: string = 'Mis alertas';
  public subTitlepage: string = '';
  public alertData: IAlert[] = [];
  public optionsTabla: IOptionTable[] = [
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
      name: 'color',
      text: 'Color',
      typeField: 'text'
    }
  ];
  public columnsTable = this.optionsTabla.map(({ name }) => name);
  private unsubscribe$ = new Subject<void>();

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.getAlerts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.subTitlepage = data.length ? `${data.length} alertas` : 'No hay alertas';
        this.alertData = [...data];
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
