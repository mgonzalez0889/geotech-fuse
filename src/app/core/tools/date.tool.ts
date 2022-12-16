import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import moment from 'moment';
import { IDateValidate } from '../interfaces/other/date.interface';
import { ToastAlertService } from '../services/toast-alert/toast-alert.service';

type DateFormatValidate = { converDateEnd: string; converDateInit: string };

@Injectable({
  providedIn: 'root',
})
export class DateTools {

  constructor(private toastAlert: ToastAlertService) { }

  set setLocale(locale: any) {
    moment.locale(locale);
  }

  public convertDate(date: Date | string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  public convertHourDate(date: Date | string): string {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
  }

  public convertHour(date: Date | string): string {
    return moment(date).format('HH:mm');
  }

  public convertDateHour(date: Date | string): string {
    return moment(date).fromNow();
  }

  public validateDateRange(dateValidate: IDateValidate): DateFormatValidate | null {
    const dateStart = new Date(dateValidate.dateInit).getTime();
    const dateEnd = new Date(dateValidate.dateEnd).getTime();
    const diff = dateStart - dateEnd;
    let converDateInit: string;
    let converDateEnd: string;

    if (Number(diff / (1000 * 60 * 60 * 24)) < 91) {
      converDateInit =
        moment(dateValidate.dateInit).format('DD/MM/YYYY')
        + ' ' + dateValidate.timeInit;

      converDateEnd =
        moment(dateValidate.dateEnd).format('DD/MM/YYYY')
        + ' ' + dateValidate.timeEnd;
    } else {
      this.toastAlert.toasAlertWarn({
        message: 'Has superado el rango de fecha.'
      });
    }

    return converDateInit && converDateEnd ? { converDateInit, converDateEnd } : null;
  }
}

