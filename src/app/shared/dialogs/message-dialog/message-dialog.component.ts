import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogAlertEnum, IDialogAlert} from "../../../core/interfaces/fuse-confirmation-config";
import {data} from "autoprefixer";

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {
  public dataView: IDialogAlert = {} as IDialogAlert;
  public iconDialog = DialogAlertEnum;
  public viewIcon: string;
  public colorIcon: string;
  constructor(
      private _dialog: MatDialogRef<MessageDialogComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any
  ) { }

  ngOnInit(): void {
      this.createDataDialog(this._data);
  }

  public createDataDialog(data: IDialogAlert): void {
      this.dataView = data;
      switch (data.type) {
          case this.iconDialog.success:
          {this.viewIcon = this.iconDialog.success; this.colorIcon = '#94FA09'; }
              break;
          case this.iconDialog.error:
          {this.viewIcon = this.iconDialog.error; this.colorIcon = '#FA093A'; }
              break;
          case this.iconDialog.warning:
          {this.viewIcon = this.iconDialog.warning; this.colorIcon = '#FC9C03'; }
              break;
          case this.iconDialog.info:
          {this.viewIcon = this.iconDialog.info; this.colorIcon = '#03F7FC'; }
              break;
          case this.iconDialog.question:
          {this.viewIcon = this.iconDialog.question; this.colorIcon = '#03B5FC'; }
              break;
      }

  }

  public closeDialog(result: any): void {
      this._dialog.close(result);
  }

}
