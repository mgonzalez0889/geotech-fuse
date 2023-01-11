import moment from 'moment';
import { Subject } from 'rxjs';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MobileService } from '@services/api/mobile.service';
import { EventsService } from '@services/api/events.service';
import { HistoriesService } from '@services/api/histories.service';
import { FleetsService } from '@services/api/fleets.service';
import { IBodyHistoric } from '@interface/index';

@Component({
  selector: 'app-form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss'],
})
export class FormReportComponent implements OnInit, OnDestroy {
  @Output() emitCloseForm = new EventEmitter<void>();
  public formReport: FormGroup = this.formBuilder.group({});
  public events: any[] = [];
  public plates: any[] = [];
  public fleets: any[] = [];
  public selectTrasport: 'mobiles' | 'fleet' = 'mobiles';
  public listTrasport: { name: string; text: string }[] = [
    {
      name: 'mobiles',
      text: 'historical.formPage.optionVehiculo',
    },
    {
      name: 'fleet',
      text: 'historical.formPage.optionFleets',
    },
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private _mobileService: MobileService,
    private _eventsService: EventsService,
    private _historicService: HistoriesService,
    private _fleetsServices: FleetsService,
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this._eventsService.getEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ data }) => this.events = [...data]
      );
    this._mobileService.selectState(state => state.mobiles)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => this.plates = [...data || []]
      );
    this._fleetsServices.selectState(state => state.fleets)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        fleets => this.fleets = [...fleets || []]
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: se ejecuta cuenta se de click en el boton de guardar y se valida el rango de fecha
   */
  public onSubmit(): void {
    const formReportValues: IBodyHistoric = this.formReport.value;
    const dateStart = new Date(formReportValues.date_init).getTime();
    const dateEnd = new Date(formReportValues.date_end).getTime();

    const diff = dateStart - dateEnd;

    if (Number(diff / (1000 * 60 * 60 * 24)) < 91) {
      const converDateInit =
        moment(formReportValues.date_init).format('DD/MM/YYYY')
        + ' ' + formReportValues.timeInit;

      const converDateEnd =
        moment(formReportValues.date_end).format('DD/MM/YYYY')
        + ' ' + formReportValues.timeEnd;

      delete formReportValues.timeInit;
      delete formReportValues.timeEnd;

      this._historicService.behaviorSubjectDataForms.next({ payload: { ...formReportValues, date_init: converDateInit, date_end: converDateEnd } });
    }
    this.emitCloseForm.emit();
  }

  /**
   * @description
   * se ejecuta con el evento del componente matRadio,
   * y dependiendo del tipo de trasporte selecciondo le agregamos
   * y quitamos validacion de requerido en el formulario
   */
  public onChangeTrasport({ value }: MatRadioChange): void {
    if (value === 'mobiles') {
      this.formReport.controls['fleets'].patchValue([]);
      this.formReport.controls['fleets'].clearValidators();
      this.formReport.controls['plates'].setValidators([Validators.required]);
    } else if (value === 'fleet') {
      this.formReport.controls['plates'].patchValue([]);
      this.formReport.controls['plates'].clearValidators();
      this.formReport.controls['fleets'].setValidators([Validators.required]);
    }
    this.formReport.controls['plates'].updateValueAndValidity();
    this.formReport.controls['fleets'].updateValueAndValidity();
    this.selectTrasport = value;
  }

  /**
   * @description: Construimos el formulario
   */
  private buildForm(): void {
    this.formReport = this.formBuilder.group({
      date_init: [new Date(), [Validators.required]],
      date_end: [new Date(), [Validators.required]],
      timeInit: ['00:00:00', [Validators.required]],
      timeEnd: ['23:59:00', [Validators.required]],
      plates: [[], [Validators.required]],
      fleets: [[]],
      events: [[], [Validators.required]],
      limit: [999999],
      page: [1],
      validationFleet: [0]
    });
  }
}
