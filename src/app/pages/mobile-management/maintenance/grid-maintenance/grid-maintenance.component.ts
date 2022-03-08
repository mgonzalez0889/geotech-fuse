import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent} from "ng-apexcharts";
import {MatDialog} from "@angular/material/dialog";
import {FormMaintenanceComponent} from "../form-maintenance/form-maintenance.component";

const ELEMENT_DATA: any[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};


@Component({
  selector: 'app-grid-maintenance',
  templateUrl: './grid-maintenance.component.html',
  styleUrls: ['./grid-maintenance.component.scss']
})
export class GridMaintenanceComponent implements OnInit {
  public dataSource: MatTableDataSource<any> = new MatTableDataSource(ELEMENT_DATA);
  public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
      private _matDialog: MatDialog
  ) {
      this.chartOptions = {
          series: [44, 55, 13, 43, 22],
          chart: {
              type: 'donut'
          },
          labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
          responsive: [
              {
                  breakpoint: 480,
                  options: {
                      chart: {
                          width: 200,
                      },
                      legend: {
                          position: 'bottom'
                      }
                  }
              }
          ]
      };
  }

  ngOnInit(): void {
  }

  public openForm(): void {
      const dialofRef = this._matDialog.open(FormMaintenanceComponent, {
          minWidth: '70%',
          minHeight: '85%',
      });
      dialofRef.afterClosed().toPromise();
  }

}
