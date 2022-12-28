import { Pipe, PipeTransform } from '@angular/core';
import { PipeDataTable } from 'app/core/interfaces/components/table.interface';
import { DateTools } from 'app/core/tools/date.tool';

@Pipe({
  name: 'dataTable',
})
export class DataTablePipe implements PipeTransform {
  private pipeDataTable: PipeDataTable = {
    text: (value: any) => value,
    percentage: (value: any) => `${value}%`,
    date: (value: any) => this.toolDate.convertHourDate(value),
    speed: (value: any) => `${value || '0'} km/h`
  };

  constructor(private toolDate: DateTools) { }

  transform(value: unknown, args: string): unknown {
    return this.pipeDataTable[args](value);
  }
}
