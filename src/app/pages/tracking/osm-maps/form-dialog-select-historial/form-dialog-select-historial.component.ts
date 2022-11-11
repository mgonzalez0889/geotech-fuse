import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from '../../../../core/services/events.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { HistoriesService } from '../../../../core/services/api/histories.service';
import { takeUntil } from 'rxjs/operators';
export interface CalendarSettings {
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'll';
  timeFormat: '12' | '24';
  startWeekOn: 6 | 0 | 1;
}

@Component({
  selector: 'app-form-dialog-select-historial',
  templateUrl: './form-dialog-select-historial.component.html',
  styleUrls: ['./form-dialog-select-historial.component.scss']
})
export class FormDialogSelectHistorialComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public settings: CalendarSettings;
  public events$: Observable<any>;
  public plates: any = this.historyService.subjectHistories.value.payload;
  public subscription: Subscription;
  public unsubscribe$: Subject<any> = new Subject<any>();
  constructor(
    private _dialog: MatDialogRef<FormDialogSelectHistorialComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private fb: FormBuilder,
    private eventsService: EventsService,
    private historyService: HistoriesService
  ) {
    this.form = this.fb.group({
      plate: [''],
      date: this.fb.group({
        date_init: ['', [Validators.required]],
        date_end: ['', [Validators.required]]
      }),
      owner_event_id: ['', [Validators.required]]
    });
    const plate: string[] = [];
    this.plates.forEach((m) => {
      plate.push(m.plate);
    });
    this.form.controls.plate.setValue(plate);
  }



  ngOnInit(): void {
    this.getEvents();
  }
  public onSelect(): void {
    const data = this.form.getRawValue();
    this.getHistories(data);
  }
  /**
   * @description: Obtiene los eventos
   */
  private getEvents(): void {
    this.events$ = this.eventsService.getEvents();
  }
  /**
   * @description: Obtiene el historico de los moviles
   */
  private getHistories(data: any): void {
    this.historyService.getHistories(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res) {
          this.historyService.subjectDataHistories.next({ payload: res, show: true });
          this.historyService.modalShowSelected$.next({ show: false });
        }
      });
  }
  /**
   * @description: Validacion de campos de formulario
   */
  public fieldIsValid(field: string) {
    return this.form.controls[field].errors
      && this.form.controls[field].touched;
  }
  /**
   * @description: Elimina las subcripciones
   */
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

}
