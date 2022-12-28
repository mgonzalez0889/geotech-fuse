import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'app/core/auth/auth.service';
import { MenuOptionsService } from 'app/core/services/api/menu-options.service';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { ToastAlertService } from '../../../../core/services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-grid-menu-options',
  templateUrl: './grid-menu-options.component.html',
  styleUrls: ['./grid-menu-options.component.scss'],
})
export class GridMenuOptionsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public dataTableMenu: MatTableDataSource<any>;
  public columnsMenu: string[] = ['name', 'description'];
  public subscription: Subscription;
  public opened: boolean = false;
  public menuCount: number = 0;
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    addMenuOption: 'configuración:gestion_de_menú:create',
    updateMenuOption: 'configuración:gestion_de_menú:update',
    deleteMenuOption: 'configuración:gestion_de_menú:delete',
  };

  constructor(
    private menuOptionsService: MenuOptionsService,
    private authService: AuthService,
    private toastAlert: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.getMenuOption();
    this.listenObservables();
    this.authService.permissionList.subscribe((permission) => {
      this.listPermission = permission;
    });
  }

  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTableMenu.filter = filterValue.trim().toLowerCase();
  }
  /**
   * @description: Trae todos las opciones del menu
   */
  public getMenuOption(): void {
    this.menuOptionsService.getMenuOptionsNew().subscribe((res) => {
      if (res.data) {
        this.menuCount = res.data.length;
      } else {
        this.menuCount = 0;
      }
      this.dataTableMenu = new MatTableDataSource(res.data);
      this.dataTableMenu.paginator = this.paginator;
      this.dataTableMenu.sort = this.sort;
    });
  }
  /**
   * @description: Crear una nueva opción
   */
  public newMenu(): void {
    if (!this.listPermission[this.permissionValid.addMenuOption]) {
      this.toastAlert.toasAlertWarn({
        message: 'No tienes permisos suficientes para realizar esta acción.',
      });
    } else {
      this.opened = true;
      this.menuOptionsService.behaviorSubjectMenuForm.next({
        newOption: 'Nueva opción',
      });
    }

  }

  /**
   * @description: Guarda la data del menu para aburirlo en el formulario
   */
  public actionsMenu(data: any): void {
    this.opened = true;
    this.menuOptionsService.behaviorSubjectMenuForm.next({
      payload: data,
      isEdit: false,
    });
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
      this.menuOptionsService.behaviorSubjectMenuGrid.subscribe(
        ({ reload, opened }) => {
          this.opened = opened;
          if (reload) {
            this.getMenuOption();
          }
        }
      );
  }
}
