import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {EventsService} from "../../../../core/services/events.service";
import {Observable, Subscription} from "rxjs";
import {HistoriesService} from "../../../../core/services/histories.service";
export interface CalendarSettings
{
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'll';
    timeFormat: '12' | '24';
    startWeekOn: 6 | 0 | 1;
}

@Component({
  selector: 'app-form-dialog-select-historial',
  templateUrl: './form-dialog-select-historial.component.html',
  styleUrls: ['./form-dialog-select-historial.component.scss']
})
export class FormDialogSelectHistorialComponent implements OnInit {
  public form: FormGroup;
  public settings: CalendarSettings;
  public events$: Observable<any>;
  public plates: any = this.historyService.subjectHistories.value.payload;
  public subscription: Subscription;
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
              date_init: '',
              date_end: ''
          }),
          owner_event_id: ['']
      });
      const plate: string[] = [];
      this.plates.forEach(m => {
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
      this.subscription = this.historyService.getHistories(data).subscribe(res => {
          console.log(res);
          this.historyService.subjectDataHistories.next({payload: res, show: true});
      });
  }

}
