/* eslint-disable @typescript-eslint/naming-convention */
import moment from 'moment';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FleetsService } from 'app/core/services/fleets.service';
import { MobileService } from 'app/core/services/mobile.service';
import { IMobiles } from 'app/core/interfaces/mobiles.interface';
import { FormReportMapComponent } from '../form-report-map/form-report-map.component';

type TypeService = { classMobileId: number; classMobileName: string };

@Component({
  selector: 'app-panel-map-main',
  templateUrl: './panel-map-main.component.html',
  styleUrls: ['./panel-map-main.component.scss']
})
export class PanelMapMainComponent implements OnInit {
  public mobileData: IMobiles[] = [];
  public fleets: any[] = [];
  public dataSource: MatTableDataSource<any>;
  public dataSourceFleets: MatTableDataSource<any>;
  public displayedColumns: string[] = ['checkbox', 'select', 'code', 'icon', 'menu'];
  public subscription: Subscription;
  public typeServices: TypeService[] = [
    {
      classMobileId: 0,
      classMobileName: 'Todos'
    }
  ];
  public selectPlates: string[] = [];
  public selectFleet: string[] = [];

  constructor(
    private mobilesService: MobileService,
    private fleetService: FleetsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.mobilesService.getMobiles().subscribe(({ data }) => {
      this.mobileData = [...data];
      this.dataSource = new MatTableDataSource([...data]);
      this.mobileData.forEach((valueMobile) => {
        const validTypeService: boolean = this.typeServices.some(
          ({ classMobileId }) => classMobileId === valueMobile.class_mobile_id
        );

        if (!validTypeService) {
          this.typeServices.push({
            classMobileId: valueMobile.class_mobile_id,
            classMobileName: valueMobile.class_mobile_name
          });
        }
      });
    });

    this.fleetService.getFleets()
      .subscribe(({ data }) => {
        console.log('data fleets', data);

        this.fleets = [...data];
        this.dataSourceFleets = new MatTableDataSource([...data]);

      });
  }

  public filterForTypeService(e: any): void {
    if (e.value === 0) {
      this.dataSource = new MatTableDataSource([...this.mobileData]);
      return;
    }

    const dataFilter = this.mobileData.filter(
      ({ class_mobile_id }) => class_mobile_id === e.value
    );

    this.dataSource = new MatTableDataSource([...dataFilter]);
  }

  public setIconView(data: any, typeService: string): any {
    const configIcon = {
      icon: '',
      text: ''
    };
    if (typeService === 'Geobolt') {
      switch (data.status) {
        case 0:
          configIcon['icon'] = 'status_close_color';
          configIcon['text'] = 'Cerrado';
          break;
        case 1:
          configIcon['icon'] = 'status_open_color';
          configIcon['text'] = 'Abierto';
          break;
      }
    } else if (typeService === 'Vehicular') {
      switch (data.status) {
        case 0:
          configIcon['icon'] = 'engine_shutdown';
          configIcon['text'] = 'Apagado';
          break;
        case 1:
          configIcon['icon'] = 'engine_ignition';
          configIcon['text'] = 'Encendido';
          break;
      }
    }
    return configIcon;
  }

  public selectMobiles(checked: boolean, data: IMobiles): void {
    if (checked) {
      this.selectPlates.push(data.plate);
    } else {
      const indexPlate = this.selectPlates.findIndex(value => value === data.plate);
      this.selectPlates.splice(indexPlate, 1);
    }
  }

  public selectFleets(checked: boolean, data: any): void {
    if (checked) {
      this.selectFleet.push(data.id);
    } else {
      const indexPlate = this.selectFleet.findIndex(value => value === data.id);
      this.selectFleet.splice(indexPlate, 1);
    }
  }

  public generateReport(): void {
    this.dialog.open(FormReportMapComponent, {
      maxWidth: '410px',
      minWidth: '390px',
      minHeight: '340px',
      maxHeight: '360px',
      data: {
        plates: this.selectPlates
      }
    });
  }

  public convertDateHour(date): string {
    moment.locale('es');
    return moment(date).fromNow();
  }

  /**
   * @description: Filtra registros de la grid
   */
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: Filtra registros de la grid
   */
  public applyFilterFleets(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFleets.filter = filterValue.trim().toLowerCase();
  }

}
