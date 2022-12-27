import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { AuthService } from 'app/core/auth/auth.service';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { EventsService } from '@services/api/events.service';

@Component({
  selector: 'app-grid-events',
  templateUrl: './grid-events.component.html',
  styleUrls: ['./grid-events.component.scss'],
})
export class GridEventsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public opened: boolean = false;
  public dataTableEvents: MatTableDataSource<any>;
  public eventsCount: number = 0;
  public columnsContactsControlCenter: string[] = [
    'color',
    'name',
    'description',
    'notificationMail',
    'notificationPage',
    'notificationSms',
    'notificationSound',
  ];
  private listPermission: NgxPermissionsObject;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private eventService: EventsService,
    private authService: AuthService,
    private toastAlert: ToastAlertService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.getEvents();
    this.listenObservables();
    this.authService.permissionList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((permission) => {
        this.listPermission = permission;
      });

    this.translocoService.langChanges$
      .pipe(delay(500), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getEvents();
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
    this.dataTableEvents.filter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: Guarda el ID del evento para aburirlo en el formulario
   */
  public actionsEvent(id: number): void {
    if (!this.listPermission['configuración:eventos:update']) {
      this.toastAlert.toasAlertWarn({
        message: 'messageAlert.messagePermissionWarn',
      });
    } else {
      this.opened = true;
      this.eventService.behaviorSubjectEventForm.next({
        id: id,
        isEdit: false,
      });
    }
  }
  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
    this.eventService.behaviorSubjectEventGrid
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ reload, opened }) => {
          this.opened = opened;
          if (reload) {
            this.getEvents();
          }
        }
      );
  }

  /**
   * @description: Mostrar todos los eventos
   */
  private getEvents(): void {
    this.eventService.getEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res.data) {
          this.eventsCount = res.data.length;
        } else {
          this.eventsCount = 0;
        }
        this.dataTableEvents = new MatTableDataSource(res.data);
        this.dataTableEvents.paginator = this.paginator;
        this.dataTableEvents.sort = this.sort;
      });
  }


}
