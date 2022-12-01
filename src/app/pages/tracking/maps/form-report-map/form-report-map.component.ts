/* eslint-disable @typescript-eslint/naming-convention */
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventsService } from 'app/core/services/events.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { DateTools } from '../../../../core/tools/date.tool';

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
    private mapService: MapToolsService,
    private dateTools: DateTools,
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
    const formReportValues = this.formReport.value;

    const dates = this.dateTools.validateDateRange(
      {
        dateInit: formReportValues.date_init,
        dateEnd: formReportValues.date_end,
        timeInit: formReportValues.timeInit,
        timeEnd: formReportValues.timeEnd
      }
    );

    if (dates) {
      delete formReportValues.timeInit;
      delete formReportValues.timeEnd;
      const dataHistory = { ...formReportValues, date_init: dates.converDateInit, date_end: dates.converDateEnd };
      const dataHistoryTrips = { date_init: dates.converDateInit, date_end: dates.converDateEnd, plates: formReportValues.plates };
      this.mapService.selectPanelMap$.next({ panel: 'history', data: { dataHistory, dataHistoryTrips } });
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
