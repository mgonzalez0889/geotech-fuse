import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
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
  eventTimeFormat: any;
  constructor(
      private _dialog: MatDialogRef<FormDialogSelectHistorialComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private fb: FormBuilder
  ) {
      this.form = this.fb.group({
          allDay          : [true],
          start           : [null],
          end             : [null],
          range: [{
              start: '',
              end: ''
          }],
      });
  }

  ngOnInit(): void {


  }

}
