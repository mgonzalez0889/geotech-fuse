/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IconsModule } from 'app/core/icons/icons.module';
import { IMobiles } from 'app/core/interfaces/mobiles.interface';
import { FleetsService } from 'app/core/services/fleets.service';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { MobileService } from 'app/core/services/mobile.service';
import { DateTools } from 'app/core/tools/date.tool';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormReportMapComponent } from '../form-report-map/form-report-map.component';

type TypeService = { classMobileId: number; classMobileName: string };

@Component({
  selector: 'app-panel-map-main',
  templateUrl: './panel-map-main.component.html',
  styleUrls: ['./panel-map-main.component.scss']
})
export class PanelMapMainComponent implements OnInit, OnDestroy, OnChanges {

  @Input() dataSocket: any = null;
  public mobileData: any[] = [];
  public fleets: any[] = [];
  public dataSource: MatTableDataSource<any>;
  public dataSourceFleets: MatTableDataSource<any>;
  public displayedColumns: string[] = ['checkbox', 'select', 'code', 'icon', 'menu'];
  public typeServices: TypeService[] = [];
  public typeServiceId: number = 0;
  public selectPlates: any[] = [];
  public selectFleet: any[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    public toolDate: DateTools,
    public iconService: IconsModule,
    private dialog: MatDialog,
    private mapService: MapToolsService,
    private fleetService: FleetsService,
    private mobilesService: MobileService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.dataSocket) {
      const indexMobile: number = this.mobileData.findIndex(({ plate }) => plate === this.dataSocket.plate);

      if (indexMobile >= 0) {

        console.log('ae', this.mobileData[indexMobile].status);

        this.mobileData[indexMobile].status = this.dataSocket.status;
        this.mobileData[indexMobile].date_entry = this.dataSocket.date_entry;
        console.log('aeaa', this.mobileData[indexMobile].status);

      }

    }
  }
  ngOnInit(): void {

    setTimeout(() => {
      this.readMobiles();
    }, 1000);

    this.fleetService.getFleets()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.fleets = [...data || []];
        this.dataSourceFleets = new MatTableDataSource([...data || []]);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: Filtra por tipo de servicio o dispositivo
   */
  public filterForTypeService(e: any): void {
    if (e.value === 0) {
      this.dataSource = new MatTableDataSource([...this.mobileData]);
      return;
    }

    const dataFilter = this.mobileData.filter(
      ({ class_mobile_id }) => class_mobile_id === e.value
    );

    this.dataSource = new MatTableDataSource([...dataFilter]);
    this.typeServiceId = e.value;
  }

  /**
   * @description: Selecciona mobiles con los check y se muestran en el mapa
   */
  public selectMobiles(checked: boolean, data: IMobiles): void {
    if (checked) {
      this.selectPlates.push(data);
    } else {
      const indexPlate = this.selectPlates.findIndex(({ plate }) => plate === data.plate);
      this.selectPlates.splice(indexPlate, 1);
    }

    if (!this.selectPlates.length) {
      this.mapService.clearMap();
      this.mapService.setMarkers(this.mobileData, true);
    } else {
      this.mapService.clearMap();
      this.mapService.setMarkers(this.selectPlates, true);
    }
  }

  /**
   * @description: Selecciona flotas con los check y se muestran en el mapa
   */
  public selectFleets(checked: boolean, data: any): void {
    if (checked) {
      this.selectFleet.push(data);
    } else {
      const indexPlate = this.selectFleet.findIndex(({ id }) => id === data.id);
      this.selectFleet.splice(indexPlate, 1);
    }

    if (!this.selectFleet.length) {
      this.mapService.clearMap();
      this.mapService.setMarkers(this.mobileData, true);
    } else {
      this.mapService.clearMap();
      this.mapService.setMarkers(data.plates, true);
    }
  }

  /**
   * @description: Modal para generar los reportes
   */
  public generateReport(): void {
    this.dialog.open(FormReportMapComponent, {
      maxWidth: '410px',
      minWidth: '390px',
      minHeight: '340px',
      maxHeight: '360px',
      data: {
        plates: this.selectPlates.map(({ plate }) => plate)
      }
    });
  }

  /**
   * @description: Filtra registros de la table de placas
   */
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: Filtra registros en la tabla de flotas
   */
  public applyFilterFleets(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFleets.filter = filterValue.trim().toLowerCase();
  }

  private readMobiles(): void {
    this.mobilesService.getMobiles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        console.log('aaaa');

        this.mobileData = [...data];
        this.dataSource = new MatTableDataSource([...data]);
        this.mobileData.forEach((valueMobile) => {
          const validTypeService: boolean = this.typeServices.some(
            ({ classMobileId }) => classMobileId === valueMobile.
              class_mobile_id
          );
          if (!validTypeService) {
            this.typeServices.push({
              classMobileId: valueMobile.class_mobile_id,
              classMobileName: valueMobile.class_mobile_name
            });
          }
        });
      });
  }

}
