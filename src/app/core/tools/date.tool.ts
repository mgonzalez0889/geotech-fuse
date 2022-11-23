import { Injectable } from '@angular/core';
import moment from 'moment';


@Injectable({
  providedIn: 'root',
})
export class DateTools {

  constructor() {
    moment.locale('es');
  }

  convertDate(date: Date | string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  convertHourDate(date: Date | string): string {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
  }

  convertHour(date: Date | string): string {
    return moment(date).format('HH:mm');
  }

  convertDateHour(date: Date | string): string {
    return moment(date).fromNow();
  }
}

