import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { TypeGeotool } from '@interface/index';
import { ContactService } from '@services/api/contact.service';
import { EventsService } from '@services/api/events.service';
import { FleetsService } from '@services/api/fleets.service';
import { GeotoolMapService } from '@services/api/geotool-map.service';
import { MobileService } from '@services/api/mobile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  @Input() titleForm: string = 'Crear alerta';
  @Input() dataUpdate: any = null;
  @Output() emitCloseForm = new EventEmitter<void>();
  public editMode: boolean = false;
  public alertFormFirst: FormGroup;
  public alertFormSecond: FormGroup;
  public alertFormThree: FormGroup;
  public events: any[] = [];
  public plates: any[] = [];
  public fleets: any[] = [];
  public geometries: any[] = [];
  public contacts: any[] = [];
  public typeGeomtry: TypeGeotool = 'none';
  public paramsMeasure: boolean = false;
  public paramsGeometry: boolean = false;
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
    private _geometryServices: GeotoolMapService
  ) {
    this.buildForms();
  }

  get getStatusAlert(): boolean {
    return this.alertFormFirst.get('statusAlert').value;
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

  ngOnInit(): void {
    console.log('aa', this.alertFormThree['controls'].paramsGeometry['controls']);

    this._eventsService.getEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ data }) => this.events = [...data]
      );

    this._mobileService.selectState(({ mobiles }) => mobiles)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => this.plates = [...data || []]
      );

    this._fleetsServices.selectState(({ fleets }) => fleets)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        fleets => this.fleets = [...fleets || []]
      );

    this._contactService.getContacts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.contacts = [...data || data];
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

  public selectGeomtry({ value }: { value: TypeGeotool }): void {
    this.typeGeomtry = value;
    this._geometryServices.getGeometry(value)
      .subscribe(({ data }) => {
        this.geometries = [...data || []];
      });
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

    console.log('values form', { ...formFirstValue, ...formSecondValue, ...formThreeValue });
  }

  private buildForms(): void {
    this.alertFormFirst = this._formBuilder.group({
      name: ['', Validators.required],
      color: ['#6B7280', Validators.required],
      statusAlert: [true],
      noticeEmail: [false],
      noticeSms: [false],
      description: [''],
      page: [false]
    });

    this.alertFormSecond = this._formBuilder.group({
      events: [[], Validators.required],
      plates: [[], [Validators.required]],
      fleets: [[]],
      contact: [''],
      incidentsCount: ['', Validators.required]
    });

    this.alertFormThree = this._formBuilder.group({
      paramsMeasure: this._formBuilder.group({
        alarmEvent: ['', Validators.required],
        condition: ['', Validators.required],
        valor: ['', Validators.required]
      }),
      paramsGeometry: this._formBuilder.group({
        alertEvent: ['', Validators.required],
        typeGeometry: ['', Validators.required],
        tolerance: ['', Validators.required]
      }),
      buzzer: [false],
      executeVehicle: [false],
      sendCommandOff: [false],
      sendCommandOn: [false],
      executeAlertOff: [false],
      executeAlertOn: [false],
      geometryId: ['']
    });

    this.alertFormThree.controls['paramsMeasure'].disable();
    this.alertFormThree.controls['paramsGeometry'].disable();
  }

}
