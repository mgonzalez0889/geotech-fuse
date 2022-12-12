/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { FleetsService } from 'app/core/services/api/fleets.service';
import { MobileService } from 'app/core/services/api/mobile.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Subject } from 'rxjs';
import { filter, mergeMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-form-fleet',
  templateUrl: './form-fleet.component.html',
  styleUrls: ['./form-fleet.component.scss'],
})
export class FormFleetComponent implements OnInit, OnDestroy {
  public fleetsPlate: any = [];
  public fleets: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public mobiles: any[] = [];
  public fleetForm: FormGroup;
  private unsubscribe$ = new Subject<void>();
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    addFleets: 'gestiondemobiles:flotas:create',
    updateFleets: 'gestiondemobiles:flotas:update',
    deleteFleets: 'gestiondemobiles:flotas:delete',
  };

  constructor(
    private fleetService: FleetsService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private toastAlert: ToastAlertService,
    private authService: AuthService,
    private mobilesService: MobileService
  ) { }

  ngOnInit(): void {
    this.createContactForm();
    this.listenObservables();
    this.mobilesService.getMobiles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.mobiles = [...data || []];
      });
    this.authService.permissionList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((permission) => {
        this.listPermission = permission;
      });
  }

  /**
   * @description: Valida si es edita o guarda una nueva flota
   */
  public onSave(): void {
    const data = this.fleetForm.getRawValue();
    if (!data.id) {
      this.newFleet(data);
    } else {
      if (!this.listPermission[this.permissionValid.updateFleets]) {
        this.toastAlert.toasAlertWarn({
          message: 'No tienes permisos suficientes para realizar esta acción.',
        });
      } else {
        this.editFleet(data);
      }
    }
  }

  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.fleetService.behaviorSubjectFleetGrid.next({
      opened: false,
      reload: false,
    });
  }

  /**
   * @description: Elimina una flota
   */
  public deleteContact(id: number): void {
    if (!this.listPermission[this.permissionValid.deleteFleets]) {
      this.toastAlert.toasAlertWarn({
        message: 'No tienes permisos suficientes para realizar esta acción.',
      });
    } else {
      const confirmation = this.confirmationService.open({
        title: 'Eliminar flota',
        message:
          '¿Está seguro de que desea eliminar esta flota? ¡Esta acción no se puede deshacer!',
      });
      confirmation.afterClosed()
        .pipe(
          filter(result => result === 'confirmed'),
          mergeMap(() => this.fleetService.deleteFleets(id).pipe(tap(() => this.fleetForm.disable()))),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((result) => {
          this.fleetForm.enable();
          if (result.code === 200) {
            this.fleetService.behaviorSubjectFleetGrid.next({
              reload: true,
              opened: false,
            });
            this.toastAlert.toasAlertSuccess({
              message: 'Flota eliminada con exito.'
            });
          } else {
            this.toastAlert.toasAlertWarn({
              message:
                'La flota no pudo ser eliminada, favor intente nuevamente.',
            });
          }
        });
    }
  }

  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: Inicializa el formulario de flotas
   */
  private createContactForm(): void {
    this.fleetForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      plates: [[], Validators.required],
    });
  }

  /**
   * @description: Escucha el observable behavior y busca la flota
   */
  private listenObservables(): void {
    this.fleetService.behaviorSubjectFleetForm
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ newFleet, payload, isEdit }) => {
          this.editMode = isEdit;
          if (newFleet) {
            this.fleetsPlate = null;
            this.fleets = [];
            this.fleets['name'] = newFleet;
            if (this.fleetForm) {
              this.fleetForm.reset();
            }
          }

          if (payload?.id) {
            this.fleets = payload;
            this.fleetForm.patchValue(this.fleets);
            this.fleetForm.patchValue({ plates: payload.plates.map(({ owner_plate_id }) => owner_plate_id )});
          }
        }
      );
  }

  /**
   * @description: Editar una flota
   */
  private editFleet(data: any): void {
    const confirmation = this.confirmationService.open();
    confirmation.afterClosed()
      .pipe(
        filter(result => result === 'confirmed'),
        mergeMap(() => this.fleetService.putFleets(data).pipe(tap(() => this.fleetForm.disable()))),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result) => {
        this.fleetForm.enable();
        if (result.code === 200) {
          this.fleetService.behaviorSubjectFleetGrid.next({
            reload: true,
            opened: false,
          });
          this.toastAlert.toasAlertSuccess({
            message: 'Flota editada con exito!',
          });
        } else {
          this.toastAlert.toasAlertWarn({
            message:
              'La flota no se pudo actualizar, favor intente nuevamente.',
          });
        }
      });
  }

  /**
   * @description: Guarda una nuevo flota
   */
  private newFleet(data: any): void {
    this.fleetForm.disable();
    this.fleetService.postFleets(data)
      .subscribe((res) => {
        this.fleetForm.enable();
        if (res.code === 200) {
          this.fleetService.behaviorSubjectFleetGrid.next({
            reload: true,
            opened: false,
          });
          this.toastAlert.toasAlertSuccess({
            message: '¡Flota creada con exito!'
          });
        } else {
          this.toastAlert.toasAlertWarn({
            message: '¡Lo sentimos algo ha salido mal, vuelva a intentarlo!'
          });
        }
      });
  }
}
