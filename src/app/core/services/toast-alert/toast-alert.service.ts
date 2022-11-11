import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IToastAlertOption } from '../../interfaces/services/toast-alert.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastAlertService {

  constructor(private snackBar: MatSnackBar) { }

  openAlert(optionAlert: IToastAlertOption): void {
    const { message, actionMessage, styleClass, duration } = optionAlert;
    this.snackBar.open(message, actionMessage || 'cerrar', {
      duration: duration || 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: styleClass || ''
    });
  }
}
