/* eslint-disable @typescript-eslint/naming-convention */
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { IMobiles } from 'app/core/interfaces/mobiles.interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HistoriesService } from 'app/core/services/api/histories.service';
import { FleetsService } from 'app/core/services/fleets.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MobileService } from 'app/core/services/mobile.service';
import { MapRequestService } from 'app/core/services/request/map-request.service';
import { FormDialogSelectHistorialComponent } from '../../osm-maps/form-dialog-select-historial/form-dialog-select-historial.component';
import { FormReportComponent } from '../../osm-maps/form-report/form-report.component';
import { MatTableDataSource } from '@angular/material/table';

type TypeService = { classMobileId: number; classMobileName: string };

@Component({
  selector: 'app-panel-map-main',
  templateUrl: './panel-map-main.component.html',
  styleUrls: ['./panel-map-main.component.scss']
})
export class PanelMapMainComponent implements OnInit {
  @Output() sendMarker: EventEmitter<any> = new EventEmitter<any>();
  public mobileData: IMobiles[] = [];
  public dataSource: MatTableDataSource<any>;
  showFiller = false;

  public displayedColumns: string[] = ['checkbox', 'select', 'code', 'menu'];
  public displayedColumnsFleets: string[] = ['select'];
  // public dataSource: any = [];
  public items: IMobiles[] = [];
  public selection = new SelectionModel<IMobiles>(true, []);
  public subscription: Subscription;
  public showMenu: boolean = true;
  public showReport: boolean = true;
  public animationStates: any;
  public visibilityStates: any;
  public showMenuGroup: boolean = false;
  public today = new Date();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
  public day = this.today.getDate();
  public initialDate: Date = new Date(this.year, this.month, this.day);
  public finalDate: Date = new Date(this.year, this.month, this.day);
  public typeServices: TypeService[] = [
    {
      classMobileId: 0,
      classMobileName: 'Todos'
    }
  ];
  constructor(
    private mobilesService: MobileService,
    private historiesService: HistoriesService,
    public dialog: MatDialog,
    public mapFunctionalitieService: MapFunctionalitieService,
    private fleetServices: FleetsService,
    public mapRequestService: MapRequestService
  ) { }

  ngOnInit(): void {
    this.listenObservableShow();

    this.mobilesService.getMobiles().subscribe(({ data }) => {
      console.log(data);

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


  public setIconView(data: any, typeService: string): string {
    let icon = '';
    if (typeService === 'Geobolt') {
      switch (data.status) {
        case 0:
          icon = 'status_open_color';
          break;
        case 1:
          icon = 'status_close_color';
          break;
      }
    } else if (typeService === 'Vehicular') {
      switch (data.status) {
        case 0:
          icon = 'engine_shutdown';
          break;
        case 1:
          icon = 'engine_ignition';
          break;
      }
    }
    return icon;
  }




  /**
   * @description: Opcion agrupar, mostrar flotas
   */
  public onShowMenuFleet(): void {
    this.historiesService.floatingMenuFleet$.next({ show: true });
  }

  public onFormModal(): void {
    const dialogRef = this.dialog.open(FormDialogSelectHistorialComponent, {
      minWidth: '25%',
      minHeight: '60%',
    });
    dialogRef.afterClosed().toPromise();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() :
      this.dataSource.data.forEach((row) => {
        this.selection.select(row);
      });

    if (this.selection.selected.length) {
      this.items.map((x) => {
        x['selected'] = true;
        return x;
      });
    } else {
      this.items.map((x) => {
        x['selected'] = false;
        return x;
      });
    }
    this.sendMarker.emit(this.items);
  }

  /**
   * @description: Selecciona un mobile individual
   */
  public individual(event, value: IMobiles): void {
    this.mapFunctionalitieService.mobiles.map((x) => {
      if (x.id == value.id) {
        x.selected = !event;
      }
      return x;
    });
    this.mapFunctionalitieService.mobile_set = this.mapFunctionalitieService.mobiles.filter(function (x) {
      return x.selected == true;
    });
    this.mapFunctionalitieService.receiveData('checked', this.mapFunctionalitieService.mobile_set)

    if (value.selected) {
      this.mapFunctionalitieService.plateHistoric.push(
        value.plate
      );
    } else {
      const indx = this.mapFunctionalitieService.plateHistoric.findIndex(v => v === value.plate);
      this.mapFunctionalitieService.plateHistoric.splice(indx, indx >= 0 ? 1 : 0);
    }
  }

  public individualFleet(event, row) {
    this.mapFunctionalitieService.fleets.map((x) => {
      if (x.id == row.id) {
        x.selected = !event;
      }
      return x;
    });

    if (!row.selected) {
      let data = this.mapFunctionalitieService.platesFleet.filter(x => {
        return x.fleetId = row.id;
      });
      this.mapFunctionalitieService.deleteChecks(data[0].data);

      const indx = this.mapFunctionalitieService.platesFleet.findIndex(v => v.fleetId === row.id);
      this.mapFunctionalitieService.platesFleet.splice(indx, indx >= 0 ? 1 : 0);
    } else {
      this.subscription = this.fleetServices.getFleetsPlateAssignedMap(row.id).subscribe(({ data }) => {
        if (data.length > 0) {
          this.mapFunctionalitieService.platesFleet.push({
            fleetId: row.id,
            data: data
          });
          this.mapFunctionalitieService.deleteChecks(this.mapFunctionalitieService.mobiles);
          this.mapFunctionalitieService.setMarkers(data, this.mapFunctionalitieService.verCluster, this.mapFunctionalitieService.verLabel);
        }
      });
    }
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
    this.mapFunctionalitieService.dataSourceFleets.filter = filterValue.trim().toLowerCase();
  }


  public generateHistoric(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(FormReportComponent, dialogConfig);
  }

  /**
   * @description: Escucha los observables
   */
  private listenObservableShow(): void {
    this.subscription = this.historiesService.modalShowSelected$.subscribe(({ show }) => {
      if (!show) {
        this.showReport = show;
      } else {
        this.showReport = show;
      }
    });
  }

}
