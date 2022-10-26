/* eslint-disable @typescript-eslint/naming-convention */
import moment from 'moment';
import { Subject } from 'rxjs';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MobileService } from '../../../../core/services/mobile.service';
import { EventsService } from '../../../../core/services/events.service';
import { HistoriesService } from '../../../../core/services/histories.service';
import { FleetsService } from '../../../../core/services/fleets.service';
import { MatRadioChange } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBodyHistoric } from '../../../../core/interfaces/form/report-historic.interface';
import { takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss'],
})
export class FormReportComponent implements OnInit, OnDestroy {
  @Output() emitCloseForm = new EventEmitter<void>();
  @ViewChild('allSelectedMobiles') private allSelectedMobiles: MatOption;
  @ViewChild('allSelectedFleets') private allSelectedFleets: MatOption;
  @ViewChild('allSelectedEvents') private allSelectedEvents: MatOption;

  public formReport: FormGroup = this.formBuilder.group({});
  public events: any[] = [];
  public plates: any[] = [];
  public fleets: any[] = [];
  public selectTrasport: 'mobiles' | 'fleet' = 'mobiles';
  public editMode: boolean = false;
  public listTrasport: { name: string; text: string }[] = [
    {
      name: 'mobiles',
      text: 'Moviles',
    },
    {
      name: 'fleet',
      text: 'Flota',
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
    this._eventsService.getEvents().pipe(takeUntil(this.unsubscribe$)).subscribe(
      ({ data }) => this.events = [...data]
    );
    this._mobileService.getMobiles().pipe(takeUntil(this.unsubscribe$)).subscribe(
      ({ data }) => this.plates = [...data]
    );
    this._fleetsServices.getFleets().pipe(takeUntil(this.unsubscribe$)).subscribe(
      ({ data }) => this.fleets = [...data]
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
        moment(formReportValues.date_init).format('DD/MM/YYYY') +
        ' 00:00:00';

      const converDateEnd =
        moment(formReportValues.date_end).format('DD/MM/YYYY') +
        ' 23:59:00';

      this._historicService.behaviorSubjectDataForms.next({ payload: { ...formReportValues, date_init: converDateInit, date_end: converDateEnd } });
      this.editMode = false;
    }
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
   * @description: seleccionar muchos de moviles
   */
  allSelectionMobiles(): void {
    if (this.allSelectedMobiles.selected) {
      this.formReport.controls['plates']
        .patchValue([...this.plates.map(item => item.plate), 0]);
    } else {
      this.formReport.controls['plates'].patchValue([]);
    }
  }

  /**
   * @description: seleccionar muchos de flotas
   */
  allSelectionFleets(): void {
    if (this.allSelectedFleets.selected) {
      this.formReport.controls['fleets']
        .patchValue([...this.fleets.map(item => item.id), 0]);
    } else {
      this.formReport.controls['fleets'].patchValue([]);
    }
  }

  /**
   * @description: seleccionar muchos de eventos
   */
  allSelectionEvents(): void {
    if (this.allSelectedEvents.selected) {
      this.formReport.controls['events']
        .patchValue([...this.events.map(item => item.event_id), 0]);
    } else {
      this.formReport.controls['events'].patchValue([]);
    }

  }

  /**
   * @description: Construimos el formulario
   */
  private buildForm(): void {
    this.formReport = this.formBuilder.group({
      date_init: [new Date(), [Validators.required]],
      date_end: [new Date(), [Validators.required]],
      plates: [[], [Validators.required]],
      fleets: [[]],
      events: [[], [Validators.required]],
      limit: [999999],
      page: [1],
      validationFleet: [0]
    });
  }
}
