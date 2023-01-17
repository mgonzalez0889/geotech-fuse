import moment from 'moment';
import { Injectable } from '@angular/core';
import { IDateValidate } from '../interfaces/other/date.interface';
import { ToastAlertService } from '../services/toast-alert/toast-alert.service';

type DateFormatValidate = { converDateEnd: string; converDateInit: string };

@Injectable({
  providedIn: 'root',
})
export class DateTools {
  public weekdays: { name: string; text: string; assigned: boolean }[] = [
    {
      name: 'monday',
      text: 'Lunes',
      assigned: false
    },
    {
      name: 'tuesday',
      text: 'Martes',
      assigned: false
    },
    {
      name: 'wednesday',
      text: 'Miercoles',
      assigned: false

    },
    {
      name: 'thursday',
      text: 'Jueves',
      assigned: false
    },
    {
      name: 'friday',
      text: 'Viernes',
      assigned: false
    },
    {
      name: 'saturday',
      text: 'Sabado',
      assigned: false
    },
    {
      name: 'sunday',
      text: 'Domingo',
      assigned: false
    },
  ];

  constructor(private toastAlert: ToastAlertService) { }


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

