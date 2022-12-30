import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DowloadTools } from '@tools/dowload.tool';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IButtonOptions, IOptionTable } from '@interface/index';
import { HistoriesService } from '@services/api/histories.service';

@Component({
  selector: 'app-grid-report',
  templateUrl: './grid-report.component.html',
  styleUrls: ['./grid-report.component.scss'],
})
export class GridReportComponent implements OnInit, OnDestroy {
  public consolidatorData: any[] = [];
  public tripsReportData: any[] = [];
  public tableData: any[] = [];
  public subscription$: Subscription;
  public detailDataReport: any;
  public optionsTable: IOptionTable[] = [];
  public displayedColumns: string[] = [];
  public opened: boolean = false;

  public buttonTableOption: IButtonOptions<any> = {
    icon: 'heroicons_solid:eye',
    text: 'consolidator.tablePage.viewMap',
    action: (data) => {
      this.detailDataReport = data;
      this.optionsTable = [...this.optionsTableTrips];
      this.displayedColumns = this.extractNameOption();

      const dataTrips = this.tripsReportData.filter(({ plate }) => plate === data.plate);
      this.tableData = [...dataTrips];
    },
  };

  public optionsTableReport: IOptionTable[] = [
    {
      name: 'plate',
      text: 'consolidator.tablePage.plate',
      typeField: 'text',
    },
    {
      name: 'fecha_inicial',
      text: 'consolidator.tablePage.dateInit',
      typeField: 'date',
    },
    {
      name: 'fecha_final',
      text: 'consolidator.tablePage.dateEnd',
      typeField: 'date',
    },
    {
      name: 'direccion_inicial',
      text: 'consolidator.tablePage.addressInitial',
      typeField: 'text',
    },
    {
      name: 'direccion_final',
      text: 'consolidator.tablePage.addressEnd',
      typeField: 'text',
    },
    {
      name: 'viajes',
      text: 'consolidator.tablePage.cantTravel',
      typeField: 'text',
    },
    {
      name: 'tiempo',
      text: 'consolidator.tablePage.timeTravel',
      typeField: 'text',
    },
    {
      name: 'paradas',
      text: 'consolidator.tablePage.cantStop',
      typeField: 'text',
    },
    {
      name: 'paradas_tiempo',
      text: 'consolidator.tablePage.timeStop',
      typeField: 'text',
    },
  ];

  public optionsTableTrips: IOptionTable[] = [
    {
      name: 'plate',
      text: 'consolidator.tablePage.plate',
      typeField: 'text',
    },
    {
      name: 'fecha_inicial',
      text: 'consolidator.tablePage.dateInit',
      typeField: 'date',
    },
    {
      name: 'fecha_final',
      text: 'consolidator.tablePage.dateEnd',
      typeField: 'date',
    },
    {
      name: 'direccion_inicial',
      text: 'consolidator.tablePage.addressInitial',
      typeField: 'text',
    },
    {
      name: 'direccion_final',
      text: 'consolidator.tablePage.addressEnd',
      typeField: 'text',
    },
    {
      name: 'tiempo',
      text: 'consolidator.tablePage.timeTravel',
      typeField: 'text',
    },
  ];

  constructor(
    private dowloadTools: DowloadTools,
    private _historicService: HistoriesService,
  ) { }

  ngOnInit(): void {
    this.optionsTable = [...this.optionsTableReport];
    this.displayedColumns = this.extractNameOption();
    this.listenObservablesReport();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public closeDetailReport(): void {
    this.detailDataReport = null;
    this.optionsTable = [...this.optionsTableReport];
    this.displayedColumns = this.extractNameOption();
    this.tableData = this.consolidatorData;
  }

  public downloadReport(typeDowload: 'csv' | 'excel'): void {
    switch (typeDowload) {
      case 'csv':
        this.dowloadTools.dowloadCsv(this.optionsTable, this.tableData, 'consolidated-report');
        break;
      case 'excel':
        this.dowloadTools.dowloadExcel(this.optionsTable, this.tableData, 'consolidated-report');
        break;
    }
  }

  private extractNameOption(): string[] {
    return this.optionsTable.map(({ name }) => name)
      .concat('action');;
  }

  private listenObservablesReport(): void {
    this.subscription$ =
      this._historicService.behaviorSubjectDataFormsTrip
        .pipe(
          filter(({ payload }) => payload !== '')
        )
        .subscribe(
          ({ payload }) => {

            this.subscription$ = this._historicService
              .getHistoriesTrip(payload)
              .subscribe((res) => {
                this.consolidatorData = res.data;
                this.tableData = res.data;
                this.tripsReportData = res.trips;
              });

            this.opened = false;

          }
        );
  }
}

