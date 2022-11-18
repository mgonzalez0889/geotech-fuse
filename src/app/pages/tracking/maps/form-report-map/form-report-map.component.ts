/* eslint-disable @typescript-eslint/naming-convention */
import moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventsService } from 'app/core/services/events.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-form-report-map',
  templateUrl: './form-report-map.component.html',
  styleUrls: ['./form-report-map.component.scss']
})
export class FormReportMapComponent implements OnInit, OnDestroy {
  @ViewChild('allSelectedEvents') private allSelectedEvents: MatOption;
  public events: any[] = [];
  public valueFilterEvents: string = '';
  public formReport: FormGroup = this.formBuilder.group({});
  private unsubscribe$ = new Subject<void>();

  constructor(
    private eventsService: EventsService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit(): void {

    this.eventsService.getEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ data }) => this.events = [...data]
      );

    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSubmit(): void {

    console.log(this.formReport.value);
    const formReportValues = this.formReport.value;
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

      const data = { ...formReportValues, date_init: converDateInit, date_end: converDateEnd };
    }
  }
  /**
   * @description: seleccionar muchos de eventos
   */
  public allSelectionEvents(): void {
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
      timeInit: ['00:00:00', [Validators.required]],
      timeEnd: ['23:59:00', [Validators.required]],
      plates: [[], [Validators.required]],
      events: [[], [Validators.required]],
      limit: [999999],
      page: [1],
      validationFleet: [0]
    });

    this.formReport.controls['plates'].patchValue([...this.data.plates]);
  }

}
