import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DriverService } from 'app/core/services/api/driver.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grid-driver',
  templateUrl: './grid-driver.component.html',
  styleUrls: ['./grid-driver.component.scss'],
})
export class GridDriverComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public subscription: Subscription;
  public opened: boolean = false;
  public dataTableDriver: MatTableDataSource<any>;
  public driversCount: number = 0;
  public listPermission: any = [];
  public columnsDrive: string[] = [
    'name',
    'identification',
    'address',
    'email',
    'cellPhone',
  ];
  private permissionValid: { [key: string]: string } = {
    addDriver: 'administracion:conductores:create',
    updateDriver: 'administracion:conductores:update',
    deleteDriver: 'administracion:conductores:delete',
  };

  constructor(
    private driverServce: DriverService,
    private toastAlert: ToastAlertService,
    private permissionsService: NgxPermissionsService
  ) { }

  ngOnInit(): void {
    this.getDriver();
    this.listenObservables();
    this.subscription = this.permissionsService.permissions$.subscribe(
      (data: any) => {
        console.log(data, 'a ver');

        this.listPermission = data ?? [];
      }
    );
  }
  /**
   * @description: Trae todos los conductores del cliente
   */
  public getDriver(): void {
    this.driverServce.getDrivers().subscribe((res) => {
      if (res.data) {
        this.driversCount = res.data.length;
      } else {
        this.driversCount = 0;
      }
      this.dataTableDriver = new MatTableDataSource(res.data);
      this.dataTableDriver.paginator = this.paginator;
      this.dataTableDriver.sort = this.sort;
    });
  }
  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTableDriver.filter = filterValue.trim().toLowerCase();
  }
  /**
   * @description: Guarda el ID del conductor para aburirlo en el formulario
   */
  public actionsContact(id: number): void {
    this.opened = true;
    this.driverServce.behaviorSubjectDriverForm.next({
      id: id,
      isEdit: false,
    });
  }
  /**
   * @description: Crear un nuevo conductor
   */
  public newDriver(): void {
    if (!this.listPermission[this.permissionValid.addDriver]) {
      this.toastAlert.toasAlertWarn({
        message:
          'No tienes permisos suficientes para realizar esta acción.',
      });
    } else {
      this.opened = true;
      this.driverServce.behaviorSubjectDriverForm.next({
        newDriver: 'Nuevo conductor',
      });
    }
  }
  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
    this.subscription =
      this.driverServce.behaviorSubjectDriverGrid.subscribe(
        ({ reload, opened }) => {
          this.opened = opened;
          if (reload) {
            this.getDriver();
          }
        }
      );
  }
}
