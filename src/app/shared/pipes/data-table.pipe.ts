import { Pipe, PipeTransform } from '@angular/core';
import { PipeDataTable } from 'app/core/interfaces/components/table.interface';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';

@Pipe({
  name: 'dataTable',
})
export class DataTablePipe implements PipeTransform {
  private pipeDataTable: PipeDataTable = {
    text: (value: any) => value,
    percentage: (value: any) => `${value}%`,
    date: (value: any) => this.toolMap.convertHourDate(value),
  };

  constructor(private toolMap: MapFunctionalitieService) { }

  transform(value: unknown, args: string): unknown {
    return this.pipeDataTable[args](value);
  }
}
