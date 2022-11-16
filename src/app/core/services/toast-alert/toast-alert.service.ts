import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IToastAlertOption } from '../../interfaces/services/toast-alert.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastAlertService {

  constructor(private snackBar: MatSnackBar) { }

  toasAlertWarn(optionAlert: IToastAlertOption): void {
    const { message, actionMessage, duration } = optionAlert;
    this.snackBar.open(message, actionMessage || 'Cerrar', {
      duration: duration || 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'alert-warn'
    });
  }

  toasAlertSuccess(optionAlert: IToastAlertOption): void {
    const { message, actionMessage, duration } = optionAlert;
    this.snackBar.open(message, actionMessage || 'Cerrar', {
      duration: duration || 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'alert-success'
    });
  }
}
