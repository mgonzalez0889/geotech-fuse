import { Injectable } from '@angular/core';
import {FuseConfirmationConfig} from "../interfaces/fuse-confirmation-config";
import {MatDialog} from "@angular/material/dialog";
import {MessageDialogComponent} from "../../shared/dialogs/message-dialog/message-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class FuseConfirmationService {

  constructor(
      public _dialog: MatDialog,

  ) { }

  public openDialog(config: FuseConfirmationConfig) {
      const dialog = this._dialog.open(MessageDialogComponent);

      // dialog

  }
}
