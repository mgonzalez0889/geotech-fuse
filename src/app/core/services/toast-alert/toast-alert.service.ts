import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IToastAlertOption } from '../../interfaces/services/toast-alert.interface';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class ToastAlertService {

  constructor(private snackBar: MatSnackBar, private translocoService: TranslocoService) { }

  toasAlertWarn(optionAlert: IToastAlertOption): void {
    const { message, actionMessage, duration } = optionAlert;
    const messageTranslate = this.translocoService.translate(message);
    const messageClose = this.translocoService.translate('buttons.buttonClose');
    this.snackBar.open(messageTranslate, actionMessage || messageClose, {
      duration: duration || 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'alert-warn'
    });
  }

  toasAlertSuccess(optionAlert: IToastAlertOption): void {
    const { message, actionMessage, duration } = optionAlert;
    const messageTranslate = this.translocoService.translate(message);
    const messageClose = this.translocoService.translate('buttons.buttonClose');
    this.snackBar.open(messageTranslate, actionMessage || messageClose, {
      duration: duration || 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'alert-success'
    });
  }
}
