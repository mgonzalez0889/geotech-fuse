import moment from 'moment';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormReportComponent } from '../form-report/form-report.component';
import { HistoriesService } from '../../../../core/services/histories.service';
import { SettingsService } from 'app/core/services/settings.service';
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
    public dialog: MatDialog,
    private _historicService: HistoriesService,
    public settingsService: SettingsService
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

  public onReport(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(FormReportComponent, dialogConfig);
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
            const dateStart = new Date(payload.date_init).getTime();
            const dateEnd = new Date(payload.date_end).getTime();
            const diff = dateStart - dateEnd;
            if (Number(diff / (1000 * 60 * 60 * 24)) < 91) {
              payload.date_init =
                moment(payload.date_init).format('DD/MM/YYYY') +
                ' 00:00:00';

              payload.date_end =
                moment(payload.date_end).format('DD/MM/YYYY') +
                ' 23:59:00';
              this.subscription$ = this._historicService
                .getHistoriesTrip(payload)
                .subscribe((res) => {
                  this.consolidatorData = res.data;
                  this.tableData = res.data;
                  this.tripsReportData = res.trips;
                });
            }

          }
        );
  }
}

