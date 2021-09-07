import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IDialogAlert, IDialogAlertResult} from '../interfaces/fuse-confirmation-config';
import {MessageDialogComponent} from '../../shared/dialogs/message-dialog/message-dialog.component';
import {FormDialogSelectHistorialComponent} from "../../pages/tracking/osm-maps/form-dialog-select-historial/form-dialog-select-historial.component";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
      private _matDialog: MatDialog,
      private _snackBar: MatSnackBar
  ) { }
    /**
     * @description: Cuadro de dialogo de confirmacion global
     */
    public showDialogAlertOption(data: IDialogAlert): Promise<IDialogAlertResult> {
      return this._matDialog.open(MessageDialogComponent, {
          panelClass: 'form-dialog-event',
          data,
          minWidth: '480px',
          minHeight: '220px',
          disableClose: data.disableClose ? true : false
      }).afterClosed().toPromise<IDialogAlertResult>();
    }

    /**
     * @description: Muestra el cuadro de dialogo select historial
     */
    public showDialogSelectHistorial(data: any): Promise<IDialogAlertResult> {
        return this._matDialog.open(FormDialogSelectHistorialComponent, {
            panelClass: 'form-dialog-event',
            data,
            minWidth: '680px',
            minHeight: '420px',
            disableClose: data.disableClose ? true : false
        }).afterClosed().toPromise<IDialogAlertResult>();
    }
}
