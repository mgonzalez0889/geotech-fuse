import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { MenuOptionsService } from 'app/core/services/api/menu-options.service';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { ToastAlertService } from '../../../../core/services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-form-menu-options',
  templateUrl: './form-menu-options.component.html',
  styleUrls: ['./form-menu-options.component.scss'],
})
export class FormMenuOptionsComponent implements OnInit, OnDestroy {
  public options: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public menuForm: FormGroup;
  public subscription: Subscription;
  public typeOptions = [
    {
      id: 0,
      type: 'basic',
      option: 'Basico',
    },
    {
      id: 1,
      type: 'collapsable',
      option: 'Plegable',
    },
    {
      id: 2,
      type: 'divider',
      option: 'División',
    },
  ];
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    addMenuOption: 'configuración:gestiondemenú:create',
    updateMenuOption: 'configuración:gestiondemenú:update',
    deleteMenuOption: 'configuración:gestiondemenú:delete',
  };
  constructor(
    private menuOptionsService: MenuOptionsService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private toastAlert: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.createMenuForm();
    this.listenObservables();
    this.authService.permissionList.subscribe((permission) => {
      this.listPermission = permission;
    });
  }
  /**
   * @description: Valida si es edita o guarda un contacto nuevo
   */
  public onSave(): void {
    this.menuForm.patchValue({
      type: 'group',
    });
    const data = this.menuForm.getRawValue();
    if (!data.id) {
      this.newMenu(data);
    } else {
      if (!this.listPermission[this.permissionValid.updateMenuOption]) {
        this.toastAlert.toasAlertWarn({
          message: 'No tienes permisos suficientes para realizar esta acción.',
        });
      } else {
        this.editMenu(data);
      }
    }
  }
  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.menuOptionsService.behaviorSubjectMenuGrid.next({
      opened: false,
      reload: false,
    });
  }
  /**
   * @description: Agrega una nueva opcion
   */
  public addOption(): void {
    const optionFormGroup = this.fb.group({
      id: [0],
      type: [''],
      title: [''],
      subtitle: [''],
      icon: [''],
      link: [''],
      disabled: [false],
      badgeSelect: [false],
      viewOption: [false],
      createOption: [false],
      editOption: [false],
      deleteOption: [false],
      badgeTitle: [''],
      badgeClasses: [''],
      children: this.fb.array([]),
    });
    (this.menuForm.get('children') as FormArray).push(optionFormGroup);
  }
  /**
   * @description: Agrega una nueva opcion del hijo
   */
  public addOptionChildren(index: number): void {
    const childrenFormGroup = this.fb.group({
      id: [0],
      type: [''],
      title: [''],
      subtitle: [''],
      icon: [''],
      link: [''],
      disabled: [false],
      badgeSelect: [false],
      viewOption: [false],
      createOption: [false],
      editOption: [false],
      deleteOption: [false],
      badgeTitle: [''],
      badgeClasses: [''],
    });
    (
      this.menuForm.get('children.' + index + '.children') as FormArray
    ).push(childrenFormGroup);
  }
  /**
   * @description: Elimina una opcion
   */
  public removeOption(index: number, id: number): void {
    if (id) {
      this.deleteMenu(id, index);
    } else {
      const optionFormArray = this.menuForm.get('children') as FormArray;
      optionFormArray.removeAt(index);
    }
  }
  /**
   * @description: Elimina una opcion del hijo
   */
  public removeOptionChildren(
    indexFather: number,
    iChildren: number,
    id: number
  ): void {
    if (id) {
      this.deleteMenu(id, indexFather, iChildren);
    } else {
      const optionFormArray2 = this.menuForm.get(
        'children.' + indexFather + '.children'
      ) as FormArray;
      optionFormArray2.removeAt(iChildren);
    }
  }

  /**
   * @description: Elimina el menu
   */
  public deleteMenu(
    id: number,
    indexFather: number,
    iChildren?: number
  ): void {
    if (!this.listPermission[this.permissionValid.deleteMenuOption]) {
      this.toastAlert.toasAlertWarn({
        message: 'No tienes permisos suficientes para realizar esta acción.',
      });
      return;
    }

    const confirmation = this.confirmationService.open({
      title: 'Eliminar opción',
      message:
        '¿Está seguro de que desea eliminar esta opción? ¡Esta acción no se puede deshacer!',
      actions: {
        confirm: {
          label: 'Eliminar',
        },
      },
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        if (iChildren) {
          const optionFormArray2 = this.menuForm.get(
            'children.' + indexFather + '.children'
          ) as FormArray;
          optionFormArray2.removeAt(iChildren);
        } else {
          const optionFormArray = this.menuForm.get(
            'children'
          ) as FormArray;
          optionFormArray.removeAt(indexFather);
        }
        this.menuOptionsService
          .deleteMenuOption(id)
          .subscribe((res) => {
            if (res.code === 200) {
              this.menuOptionsService.behaviorSubjectMenuGrid.next(
                {
                  reload: true,
                  opened: false,
                }
              );
              this.toastAlert.toasAlertSuccess({
                message: 'Opción eliminada con exito!',
              });
            } else {
              this.toastAlert.toasAlertWarn({
                message:
                  'La opción no se pudo eliminar, favor intente nuevamente.',
              });
            }
          });
      }
    });
  }
  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
   * @description: Inicializa el formulario de opciones
   */
  private createMenuForm(): void {
    this.menuForm = this.fb.group({
      id: [''],
      type: ['group'],
      title: ['', [Validators.required]],
      subtitle: [''],
      children: this.fb.array([]),
    });
  }
  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
    this.subscription =
      this.menuOptionsService.behaviorSubjectMenuForm.subscribe(
        ({ newOption, payload, isEdit }) => {
          this.editMode = isEdit;
          if (newOption) {
            this.options = [];
            this.options['title'] = newOption;
            if (this.menuForm) {
              this.menuForm.reset();
            }
          } else {
            if (this.menuForm) {
              this.menuForm.reset();
            }
            this.options = payload;
            this.clearFormArray();
            this.options.children.forEach((x: any) => {
              const children: FormGroup = this.newChildren();
              (this.menuForm.get('children') as FormArray).push(
                children
              );
              x.children.forEach(() => {
                const children2 = this.newChildrenOfChildren();
                (children.get('children') as FormArray).push(
                  children2
                );
              });
            });
            this.menuForm.patchValue(this.options);
          }
        }
      );
  }
  /**
   * @description: Crea el formulario del hijo
   */
  private newChildren(): FormGroup {
    return this.fb.group({
      id: [0],
      type: [''],
      title: [''],
      subtitle: [''],
      icon: [''],
      link: [''],
      disabled: [false],
      badgeSelect: [false],
      viewOption: [false],
      createOption: [false],
      editOption: [false],
      deleteOption: [false],
      badgeTitle: [''],
      badgeClasses: [''],
      children: this.fb.array([]),
    });
  }
  /**
   * @description: Crea el formulario del hijo del hijo
   */
  private newChildrenOfChildren(): FormGroup {
    return this.fb.group({
      id: [''],
      type: [''],
      title: [''],
      subtitle: [''],
      icon: [''],
      link: [''],
      disabled: [false],
      badgeSelect: [false],
      viewOption: [false],
      createOption: [false],
      editOption: [false],
      deleteOption: [false],
      badgeTitle: [''],
      badgeClasses: [''],
    });
  }
  /**
   * @description: Reinicia el formulario
   */
  private clearFormArray(): any {
    this.menuForm.reset();
  }
  /**
   * @description: Metdo para crear un nuevo menu
   */
  private newMenu(data: any): void {
    this.menuForm.disable();
    this.menuOptionsService.postMenuOption(data).subscribe((res) => {
      this.menuForm.enable();
      if (res.code === 200) {
        this.menuOptionsService.behaviorSubjectMenuGrid.next({
          reload: true,
          opened: false,
        });
        this.toastAlert.toasAlertSuccess({
          message: 'Opción creada con exito!',
        });
      } else {
        this.toastAlert.toasAlertWarn({
          message:
            'La opción no se pudo crear, favor intente nuevamente.',
        });
      }
    });
  }
  /**
   * @description: Metdo para editar un menu
   */
  private editMenu(data: any): any {
    this.menuForm.disable();
    const confirmation = this.confirmationService.open({
      title: 'Editar opción ',
      message:
        '¿Está seguro de que desea editar esta opción? ¡Esta acción no se puede deshacer!',
      actions: {
        confirm: {
          label: 'Editar',
          color: 'accent',
        },
      },
      icon: {
        name: 'heroicons_outline:pencil',
        color: 'info',
      },
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.menuOptionsService.putMenuOption(data).subscribe((res) => {
          this.menuForm.enable();
          if (res.code === 200) {
            this.menuOptionsService.behaviorSubjectMenuGrid.next({
              reload: true,
              opened: false,
            });
            this.toastAlert.toasAlertSuccess({
              message: 'Opción editada con exito!',
            });
          } else {
            this.toastAlert.toasAlertWarn({
              message:
                'La opción no se pudo actualizar, favor intente nuevamente.',
            });
          }
        });
      }
    });
  }
}
