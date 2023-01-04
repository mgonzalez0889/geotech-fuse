import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'app/core/auth/auth.service';
import { FleetsService } from 'app/core/services/api/fleets.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-grid-fleet',
  templateUrl: './grid-fleet.component.html',
  styleUrls: ['./grid-fleet.component.scss'],
})
export class GridFleetComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public subscription: Subscription;
  public opened: boolean = false;
  public dataTableFleet: MatTableDataSource<any>;
  public fleetsCount: number = 0;
  public columnsFleet: string[] = ['name', 'description'];
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    addFleets: 'gestion_de_mobiles:flotas:create',
    updateFleets: 'gestion_de_mobiles:flotas:update',
    deleteFleets: 'gestion_de_mobiles:flotas:delete',
  };
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fleetService: FleetsService,
    private toastAlert: ToastAlertService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.fleetService.selectState(state => state.fleets)
      .pipe(takeUntil(this.unsubscribe$),)
      .subscribe((fleets) => {
        if (fleets) {
          this.fleetsCount = fleets.length;
        } else {
          this.fleetsCount = 0;
        }
        this.dataTableFleet = new MatTableDataSource(fleets);
        this.dataTableFleet.paginator = this.paginator;
        this.dataTableFleet.sort = this.sort;
      });
    this.listenObservables();
    this.authService.permissionList.subscribe((permission) => {
      this.listPermission = permission;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTableFleet.filter = filterValue.trim().toLowerCase();
  }
  /**
   * @description: Guarda el ID del contacto para aburirlo en el formulario
   */
  public actionsFleet(id: any): void {
    this.opened = true;
    this.fleetService.behaviorSubjectFleetForm.next({
      payload: id,
      isEdit: false,
    });
  }
  /**
   * @description: Crear un nuevo contacto
   */
  public newFleet(): void {
    if (!this.listPermission[this.permissionValid.addFleets]) {
      this.toastAlert.toasAlertWarn({
        message: 'messageAlert.messagePermissionWarn',
      });
    } else {
      this.opened = true;
      this.fleetService.behaviorSubjectFleetForm.next({
        newFleet: 'Nueva flota',
        payload: null,
      });
    }

  }


  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
    this.subscription =
      this.fleetService.behaviorSubjectFleetGrid.subscribe(
        ({ reload, opened }) => {
          this.opened = opened;
          if (reload) {
            this.fleetService.getFleets().toPromise();
          }
        }
      );
  }
}
