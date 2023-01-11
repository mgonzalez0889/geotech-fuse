import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { IButtonOptions, IOptionTable } from '@interface/index';
import { DowloadTools } from '@tools/dowload.tool';
import { HistoriesService } from '@services/api/histories.service';

@Component({
  selector: 'app-grid-report',
  templateUrl: './grid-report.component.html',
  styleUrls: ['./grid-report.component.scss'],
})
export class GridReportComponent implements OnInit, OnDestroy {
  public historicData: any[] = [];
  public dataForm: any;
  public opened: boolean = false;
  /**
   * @description: Json para renderizar un boton en la tabla
   */
  public buttonTableOption: IButtonOptions<any> = {
    icon: 'feather:map',
    text: 'historical.tablePage.viewMap',
    action: (data) => {
      window.open(`https://maps.google.com/?q=${data.x},${data.y}`);
    },
  };

  /**
   * @description: Array con la configuracion de los campos en la tabla
   */
  public optionsTable: IOptionTable[] = [
    {
      name: 'plate',
      text: 'historical.tablePage.plate',
      typeField: 'text',
    },
    {
      name: 'date_entry',
      text: 'historical.tablePage.date',
      typeField: 'date',
    },
    {
      name: 'event_name',
      text: 'historical.tablePage.event',
      typeField: 'text',
    },
    {
      name: 'address',
      text: 'historical.tablePage.adrress',
      typeField: 'text',
    },
    {
      name: 'x',
      text: 'historical.tablePage.latitude',
      typeField: 'text',
    },
    {
      name: 'y',
      text: 'historical.tablePage.longitude',
      typeField: 'text',
    },
    {
      name: 'speed',
      text: 'historical.tablePage.speed',
      typeField: 'speed',
    },
    {
      name: 'battery',
      text: 'historical.tablePage.battery',
      typeField: 'percentage',
    },
  ];

  public displayedColumns: string[] = this.optionsTable
    .map(({ name }) => name)
    .concat('action');

  private unsubscribe$ = new Subject<void>();

  constructor(
    private dowloadTools: DowloadTools,
    private _historicService: HistoriesService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.listenObservablesReport();
    this.translocoService.langChanges$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.dataForm) {
          this.readHistoryData();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public downloadReport(typeDowload: 'csv' | 'excel'): void {
    switch (typeDowload) {
      case 'csv':
        this.dowloadTools.dowloadCsv(this.optionsTable, this.historicData, 'historic-event-report');
        break;
      case 'excel':
        this.dowloadTools.dowloadExcel(this.optionsTable, this.historicData, 'historic-event-report');
        break;
    }
  }

  /**
   * @description: se parsea la informacion del reporte y se envia por parametros a otra pagina
   */
  public viewReportTimeLine(): void {
    let queryParams: string = '?';
    Object.entries(this.dataForm).forEach(([key, value]) => {
      queryParams += `${key}=${value}&`;
    });
    window.open(`/app/reports/general-report/time-line${queryParams}`);
  }

  /**
   * @description: escuchamos cuando se haga el envio de informacion del formulario
   */
  private listenObservablesReport(): void {
    this._historicService.behaviorSubjectDataForms
      .pipe(
        filter(({ payload }) => payload !== ''),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        ({ payload }) => {
          this.dataForm = payload;
          this.readHistoryData();
        }
      );
  }

  private readHistoryData(): void {
    this._historicService
      .getHistories(this.dataForm)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.historicData =
          res.code === 400 ? [] : res.data;
      });
  }
}
