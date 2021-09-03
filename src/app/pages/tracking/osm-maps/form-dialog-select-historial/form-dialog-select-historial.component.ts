import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-form-dialog-select-historial',
  templateUrl: './form-dialog-select-historial.component.html',
  styleUrls: ['./form-dialog-select-historial.component.scss']
})
export class FormDialogSelectHistorialComponent implements OnInit {

  constructor(
      private _dialog: MatDialogRef<FormDialogSelectHistorialComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any
  ) { }

  ngOnInit(): void {
  }

}
