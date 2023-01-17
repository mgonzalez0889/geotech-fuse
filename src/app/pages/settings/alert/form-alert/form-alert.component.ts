import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { TypeGeotool } from '@interface/index';
import { ContactService } from '@services/api/contact.service';
import { EventsService } from '@services/api/events.service';
import { FleetsService } from '@services/api/fleets.service';
import { GeotoolMapService } from '@services/api/geotool-map.service';
import { MobileService } from '@services/api/mobile.service';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarDaysComponent } from '../calendar-days/calendar-days.component';

interface ISelectOptions {
  name: string;
  text: string;
}

@Component({
  selector: 'app-form-alert',
  templateUrl: './form-alert.component.html',
  styleUrls: ['./form-alert.component.scss']
})
export class FormAlertComponent implements OnInit {
  @Input() titleForm: string = '';
  @Input() dataUpdate: any = null;
  @Output() emitCloseForm = new EventEmitter<void>();
  @Output() actionsForm = new EventEmitter<{ action: string; data: any }>();
  public editMode: boolean = false;
  public alertFormFirst: FormGroup;
  public alertFormSecond: FormGroup;
  public alertFormThree: FormGroup;
  public events: any[] = [];
  public plates: any[] = [];
  public fleets: any[] = [];
  public geometries: any[] = [];
  public contacts: any[] = [];
  public viewRange: boolean = false;
  public typeGeomtry: TypeGeotool = 'none';
  public paramsMeasure: boolean = false;
  public paramsGeometry: boolean = false;
  public arrayBlockDays: any[] = [];
  public selectExecuteDate: string = 'always';
  public optionsExecuteDate: ISelectOptions[] = [
    {
      name: 'always',
      text: 'Por siempre'
    },
    {
      name: 'dateSpecify',
      text: 'Fecha especifica'
    },
    {
      name: 'days',
      text: 'En los dias'
    }
  ];
  public selectTrasport: 'mobiles' | 'fleet' = 'mobiles';
  public listTrasport: ISelectOptions[] = [
    {
      name: 'mobiles',
      text: 'Por vehiculo',
    },
    {
      name: 'fleet',
      text: 'Por grupo',
    },
  ];
  public listAlarmEvent: ISelectOptions[] = [
    {
      name: 'horometro',
      text: 'Horometro',
    },
    {
      name: 'ralenti',
      text: 'Ralenti'
    },
    {
      name: 'speed',
      text: 'Velocidad'
    },
    {
      name: 'temperature',
      text: 'Temperatura'
    },
    {
      name: 'battery',
      text: 'Bateria',
    },
    {
      name: 'odometro',
      text: 'Odometro',
    },
  ];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    private _eventsService: EventsService,
    private _mobileService: MobileService,
    private _fleetsServices: FleetsService,
    private _contactService: ContactService,
    private _geometryServices: GeotoolMapService,
    private _toastAlert: ToastAlertService,
    private _dialog: MatDialog,
  ) {
    this.buildForms();
  }

  get getStatusAlert(): boolean {
    return this.alertFormFirst.get('statusAlert').value;
  }

  get getSendCommand(): boolean {
    return this.alertFormThree.get('sendCommand').value;
  }

  get getExecuteAlertOff(): boolean {
    return this.alertFormThree.get('executeAlertOff').value;
  }

  get getExecuteAlertOn(): boolean {
    return this.alertFormThree.get('executeAlertOn').value;
  }

  get getControlsFormFirst(): {
    [key: string]: AbstractControl;
  } {
    return this.alertFormFirst.controls;
  }

  get getControlsThreeParamGeomtry(): {
    [key: string]: AbstractControl;
  } {
    return this.alertFormThree['controls'].paramsGeometry['controls'];
  }

  get getControlsThreeParamMeasure(): FormGroup {
    return this.alertFormThree['controls'].paramsGeometry as FormGroup;
  }

  ngOnInit(): void {
    this._eventsService.getEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ({ data }) => {
          this.events = [...data || data];
        },
        error: ({ error }) => {
          this._toastAlert.toasAlertWarn({
            message: `${error.error}`
          });
        }
      });

    this._mobileService.selectState(({ mobiles }) => mobiles)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (plates) => {
          this.plates = plates;
        },
        error: ({ error }) => {
          this._toastAlert.toasAlertWarn({
            message: `${error.error}`
          });
        }
      });

    this._fleetsServices.selectState(({ fleets }) => fleets)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (fleets) => {
          this.fleets = fleets;
        },
        error: ({ error }) => {
          this._toastAlert.toasAlertWarn({
            message: `${error.error}`
          });
        }
      });

    this._contactService.getContacts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ({ data }) => {
          this.contacts = [...data || data];
        },
        error: ({ error }) => {
          this._toastAlert.toasAlertWarn({
            message: `${error.error}`
          });
        }
      });
  }

  /**
   * @description: Aciones cuando se cierre el formulario
   */
  public closeForm(): void {
    this.emitCloseForm.emit();
  }

  public disabledParamsMeasure(event: MatCheckboxChange): void {
    this.paramsMeasure = event.checked;
    if (!this.paramsMeasure) {
      this.alertFormThree.controls['paramsMeasure'].disable();
    } else {
      this.alertFormThree.controls['paramsMeasure'].enable();
    }
  }

  public disabledParamsGeometry(event: MatCheckboxChange): void {
    this.paramsGeometry = event.checked;
    if (!this.paramsGeometry) {
      this.alertFormThree.controls['paramsGeometry'].disable();
    } else {
      this.alertFormThree.controls['paramsGeometry'].enable();
    }
  }

  public changeExecuteDate({ value }: MatRadioChange): void {
    if (value === 'days') {
      const dialogRef = this._dialog.open(CalendarDaysComponent, {
        maxWidth: '360px',
        minWidth: '340px',
        minHeight: '260px',
        maxHeight: '280px',
      });
    }
  }

  public selectGeomtry({ value }: { value: TypeGeotool }): void {
    this.typeGeomtry = value;
    this._geometryServices.getGeometry(value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ({ data }) => {
          this.geometries = [...data || []];
        },
        error: ({ error }) => {
          this._toastAlert.toasAlertWarn({
            message: `${error.error}`
          });
        }
      });
  }

  public selectCondition({ value }: { value: string }): void {
    this.viewRange = value === 'range';
    if (value === 'range') {
      this.getControlsThreeParamMeasure['rangeFrom'].setValidators([Validators.required]);
      this.getControlsThreeParamMeasure['rangeTo'].setValidators([Validators.required]);
      this.getControlsThreeParamMeasure['value'].clearValidators();
    } else {
      this.getControlsThreeParamMeasure['value'].setValidators([Validators.required]);
      this.getControlsThreeParamMeasure['rangeFrom'].clearValidators();
      this.getControlsThreeParamMeasure['rangeTo'].clearValidators();
    }
    this.getControlsThreeParamMeasure['value'].updateValueAndValidity();
    this.getControlsThreeParamMeasure['rangeTo'].updateValueAndValidity();
    this.getControlsThreeParamMeasure['rangeFrom'].updateValueAndValidity();
  }

  /**
   * @description
   * se ejecuta con el evento del componente matRadio,
   * y dependiendo del tipo de trasporte selecciondo le agregamos
   * y quitamos validacion de requerido en el formulario
   */
  public onChangeTrasport({ value }: MatRadioChange): void {
    if (value === 'mobiles') {
      this.alertFormSecond.controls['fleets'].patchValue([]);
      this.alertFormSecond.controls['fleets'].clearValidators();
      this.alertFormSecond.controls['plates'].setValidators([Validators.required]);
    } else if (value === 'fleet') {
      this.alertFormSecond.controls['plates'].patchValue([]);
      this.alertFormSecond.controls['plates'].clearValidators();
      this.alertFormSecond.controls['fleets'].setValidators([Validators.required]);
    }
    this.alertFormSecond.controls['plates'].updateValueAndValidity();
    this.alertFormSecond.controls['fleets'].updateValueAndValidity();
    this.selectTrasport = value;
  }

  public sendDataForms(): void {

    const formFirstValue = this.alertFormFirst.value;
    const formSecondValue = this.alertFormSecond.value;
    const formThreeValue = this.alertFormThree.value;

    if (this.dataUpdate) {
    } else {
      this.actionsForm.emit({ action: 'add', data: formFirstValue });
    }

  }

  private buildForms(): void {
    this.alertFormFirst = this._formBuilder.group({
      name: ['', Validators.required],
      color: ['#6B7280', Validators.required],
      statusAlert: [true],
      noticeEmail: [false],
      noticeSms: [false],
      description: [''],
      page: [false],
      attend: [true],
      dateExecute: ['', Validators.required],
    });

    this.alertFormSecond = this._formBuilder.group({
      events: [[], Validators.required],
      plates: [[], [Validators.required]],
      fleets: [[]],
      contact: [''],
      incidentsCount: [1, Validators.required]
    });

    this.alertFormThree = this._formBuilder.group({
      paramsMeasure: this._formBuilder.group({
        alarmEvent: ['', Validators.required],
        condition: ['', Validators.required],
        value: ['', Validators.required],
        rangeFrom: [''],
        rangeTo: ['']
      }),
      paramsGeometry: this._formBuilder.group({
        alertEvent: ['', Validators.required],
        typeGeometry: ['', Validators.required],
        tolerance: ['', Validators.required]
      }),
      buzzer: [false],
      executeVehicle: [false],
      sendCommand: [false],
      executeAlertOff: [false],
      executeAlertOn: [false],
      geometryId: ['']
    });

    this.alertFormThree.controls['paramsMeasure'].disable();
    this.alertFormThree.controls['paramsGeometry'].disable();
  }

}
