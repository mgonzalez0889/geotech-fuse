import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IDialogAlert, IDialogAlertResult} from '../interfaces/fuse-confirmation-config';
import {MessageDialogComponent} from '../../shared/dialogs/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
      private _matDialog: MatDialog,
      private _snackBar: MatSnackBar
  ) { }

    public showDialogAlertOption(data: IDialogAlert): Promise<IDialogAlertResult> {
      return this._matDialog.open(MessageDialogComponent, {
          panelClass: 'form-dialog-event',
          data,
          minWidth: '480px',
          minHeight: '220px',
          disableClose: data.disableClose ? true : false
      }).afterClosed().toPromise<IDialogAlertResult>();
    }
}
