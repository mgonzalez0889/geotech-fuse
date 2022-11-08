import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HistoriesService } from '../../../../core/services/histories.service';
import { IButtonOptions } from '../../../../core/interfaces/components/table.interface';
import {
  IOptionTable,
} from '../../../../core/interfaces/components/table.interface';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-grid-report',
  templateUrl: './grid-report.component.html',
  styleUrls: ['./grid-report.component.scss'],
})
export class GridReportComponent implements OnInit, OnDestroy {
  public titlePage: string = 'Consolidado de viajes';
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
    text: 'ver detalle',
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
      text: 'Placa',
      typeField: 'text',
    },
    {
      name: 'fecha_inicial',
      text: 'Fecha inicial',
      typeField: 'date',
    },
    {
      name: 'fecha_final',
      text: 'Fecha final',
      typeField: 'date',
    },
    {
      name: 'direccion_inicial',
      text: 'Dirección Inicial',
      typeField: 'text',
    },
    {
      name: 'direccion_final',
      text: 'Dirección Final',
      typeField: 'text',
    },
    {
      name: 'viajes',
      text: 'N° de Viajes',
      typeField: 'text',
    },
    {
      name: 'tiempo',
      text: 'Tiempo de viajes',
      typeField: 'text',
    },
    {
      name: 'paradas',
      text: 'N° de paradas',
      typeField: 'text',
    },
    {
      name: 'paradas_tiempo',
      text: 'Tiempo de paradas',
      typeField: 'text',
    },
  ];

  public optionsTableTrips: IOptionTable[] = [
    {
      name: 'plate',
      text: 'Placa',
      typeField: 'text',
    },
    {
      name: 'fecha_inicial',
      text: 'Fecha inicial',
      typeField: 'date',
    },
    {
      name: 'fecha_final',
      text: 'Fecha final',
      typeField: 'date',
    },
    {
      name: 'direccion_inicial',
      text: 'Dirección Inicial',
      typeField: 'text',
    },
    {
      name: 'direccion_final',
      text: 'Dirección Final',
      typeField: 'text',
    },
    {
      name: 'tiempo',
      text: 'Tiempo de viajes',
      typeField: 'text',
    },
  ];

  constructor(
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

          }
        );
  }
}

