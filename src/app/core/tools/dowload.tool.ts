import { Injectable } from '@angular/core';
import { IOptionTable } from '../interfaces';
import * as XLSX from 'xlsx';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class DowloadTools {

  constructor(private translocoService: TranslocoService) { }
  public dowloadCsv<T = any>(options: IOptionTable[], dataRow: T[], nameFile: string): void {
    const csvTemp: string[] = [];
    const headers: string[] = options.map(({ text }) => this.translocoService.translate(text));
    csvTemp[0] = headers.join(',');

    dataRow.forEach((data) => {
      const valuesRow = options.map(({ name }) => data[name]);
      csvTemp.push(valuesRow.join(','));
    });

    const blob = new Blob([csvTemp.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const aElement = document.createElement('a');
    aElement.setAttribute('hidden', '');
    aElement.setAttribute('href', url);
    aElement.setAttribute('download', `${nameFile}.csv`);
    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
  }

  public dowloadExcel<T = any>(options: IOptionTable[], dataRow: T[], nameFile: string): void {
    const parseArray = [];
    dataRow.forEach((row) => {
      const obj = {};
      options.forEach(({ name, text }) => {
        const textTransalte = this.translocoService.translate(text);
        obj[textTransalte] = row[name];
      });
      parseArray.push(obj);
    });
    const ws = XLSX.utils.json_to_sheet(parseArray);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nameFile);
    XLSX.writeFile(wb, `${nameFile}.xlsx`);
  }
}
