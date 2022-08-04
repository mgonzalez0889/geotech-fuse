import { Injectable } from '@angular/core';
import {ConfirmationConfig} from '../interfaces/fuse-confirmation-config';
import {MatDialog} from '@angular/material/dialog';
import {MessageDialogComponent} from '../../shared/dialogs/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(
      public _dialog: MatDialog,
  ) { }
  /**
   * @description: Cuadro de dialogo para confirmacion
   */
  public openDialog(data: ConfirmationConfig): Promise<ConfirmationConfig> {
      return this._dialog.open(MessageDialogComponent , {
          data,
          maxWidth: '88vw',
          height: '450px',
          disableClose: data.dismissible ? true: false
      }).afterClosed().toPromise();
  }
}
