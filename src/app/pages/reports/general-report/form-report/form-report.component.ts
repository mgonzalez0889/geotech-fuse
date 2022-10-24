/* eslint-disable @typescript-eslint/naming-convention */
import moment from 'moment';
import { Observable } from 'rxjs';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MobileService } from '../../../../core/services/mobile.service';
import { EventsService } from '../../../../core/services/events.service';
import { HistoriesService } from '../../../../core/services/histories.service';
import { FleetsService } from '../../../../core/services/fleets.service';
import { MatRadioChange } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBodyHistoric } from '../../../../core/interfaces/form/report-historic.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss'],
})
export class FormReportComponent implements OnInit {
  @Output() emitCloseForm = new EventEmitter<void>();
  public formReport: FormGroup = this.formBuilder.group({});
  public select: boolean;
  public fleets$: Observable<any>;
  public events$: Observable<any>;
  public mobiles$: Observable<any>;
  public plates: any[] = [];
  public flotas: any[] = [];
  public selectTrasport: string = 'mobiles';
  public editMode: boolean = false;
  listTrasport: { name: string; text: string }[] = [
    {
      name: 'mobiles',
      text: 'Moviles',
    },
    {
      name: 'fleet',
      text: 'Flota',
    },
  ];

  constructor(

    private _mobileService: MobileService,
    private _eventsService: EventsService,
    private _historicService: HistoriesService,
    private _fleetsServices: FleetsService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.events$ = this._eventsService.getEvents();
  }



  public buildForm(): void {
    this.formReport = this.formBuilder.group({
      date_init: [new Date(), [Validators.required]],
      date_end: [new Date(), [Validators.required]],
      plates: [[]],
      fleets: [[]],
      events: [[]],
      limit: [999999],
      page: [1],
      validationFleet: [0]
    });
  }

  public onSubmit(): void {
    const formReportValues: IBodyHistoric = this.formReport.value;

    const dateStart = new Date(formReportValues.date_init).getTime();
    const dateEnd = new Date(formReportValues.date_end).getTime();

    const diff = dateStart - dateEnd;

    if (Number(diff / (1000 * 60 * 60 * 24)) < 91) {
      const converDateInit =
        moment(formReportValues.date_init).format('DD/MM/YYYY') +
        ' 00:00:00';

      const converDateEnd =
        moment(formReportValues.date_end).format('DD/MM/YYYY') +
        ' 23:59:00';

      this._historicService.behaviorSubjectDataForms.next({ payload: { ...formReportValues, date_init: converDateInit, date_end: converDateEnd } });

    }
  }

  /**
   * @description se carga la informacion en el mat-select dependiendo del tipo de trasporte
   */
  public onChangeTrasport({ value }: MatRadioChange): void {
    if (value === 'mobiles') {
      this.select = true;
      this.mobiles$ = this._mobileService.getMobiles();
      this.flotas = [];
    } else if (value === 'fleet') {
      this.select = false;
      this.fleets$ = this._fleetsServices.getFleets();
      this.plates = [];
    }
    this.selectTrasport = value;
  }
}
