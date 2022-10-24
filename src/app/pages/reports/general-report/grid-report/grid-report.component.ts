import moment from 'moment';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IButtonOptions, IOptionTable } from 'app/core/interfaces/components/table.interface';
import { HistoriesService } from 'app/core/services/histories.service';
import { FormReportComponent } from '../form-report/form-report.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-grid-report',
  templateUrl: './grid-report.component.html',
  styleUrls: ['./grid-report.component.scss'],
})
export class GridReportComponent implements OnInit, OnDestroy {
  public titlePage: string = 'Historico y eventos';
  public historicData: any[] = [];
  public subscription$: Subscription;
  public dataSendTimeLine: any;
  public opened: boolean = false;

  public buttonTableOption: IButtonOptions<any> = {
    icon: 'feather:map',
    text: 'ver mapa',
    action: (data) => {
      window.open(`https://maps.google.com/?q=${data.x},${data.y}`);
    },
  };

  public optionsTable: IOptionTable[] = [
    {
      name: 'plate',
      text: 'Placa',
      typeField: 'text',
    },
    {
      name: 'date_entry',
      text: 'Fecha',
      typeField: 'date',
    },
    {
      name: 'event_name',
      text: 'Evento',
      typeField: 'text',
    },
    {
      name: 'address',
      text: 'Dirección',
      typeField: 'text',
    },
    {
      name: 'x',
      text: 'Latitud',
      typeField: 'text',
    },
    {
      name: 'y',
      text: 'Longitud',
      typeField: 'text',
    },
    {
      name: 'speed',
      text: 'Velocidad',
      typeField: 'text',
    },
    {
      name: 'battery',
      text: 'Batería',
      typeField: 'percentage',
    },
  ];

  public displayedColumns: string[] = this.optionsTable
    .map(({ name }) => name)
    .concat('action');

  constructor(
    public dialog: MatDialog,
    private _historicService: HistoriesService
  ) { }

  ngOnInit(): void {
    this.listenObservablesReport();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public viewReportTimeLine(): void {
    let queryParams: string = '?';
    Object.entries(this.dataSendTimeLine).forEach(([key, value]) => {
      queryParams += `${key}=${value}&`;
    });
    window.open(`/app/reports/general-report/time-line${queryParams}`);
  }

  public showForm(): void {
    this.opened = true;
  }


  private listenObservablesReport(): void {
    this.subscription$ =
      this._historicService.behaviorSubjectDataForms
        .pipe(
          filter(({ payload }) => payload !== '')
        )
        .subscribe(
          ({ payload }) => {
            console.log(payload);

            this.dataSendTimeLine = payload;

            this.subscription$ = this._historicService
              .getHistories(payload)
              .subscribe((res) => {
                this.historicData =
                  res.code === 400 ? [] : res.data;
              });
          }

        );
  }
}
