import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';
import { fuseAnimations } from '@fuse/animations';
import { IOptionTable } from '@interface/index';
import { UsersService } from '@services/api/users.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-form-linkage',
  templateUrl: './form-linkage.component.html',
  styleUrls: ['./form-linkage.component.scss'],
  animations: fuseAnimations
})
export class FormLinkageComponent implements OnInit {
  @Input() dataUpdate: any = null;
  @Input() titleForm: string = '';
  @Output() emitCloseForm = new EventEmitter<void>();
  public subTitlePage: string = '';
  public hidePassword: boolean = false;
  public titlePage: string = 'Agregar contrato cliente';
  public opened: boolean = false;
  public userDataUpdate: any = null;
  public dataFilter: string = '';
  public userData: any[] = [];
  public formUser: FormGroup = this.fb.group({});
  public editMode: boolean = false;


  public countrieFlag: { code: string; flagImagePos: string } = { code: '+57', flagImagePos: '' };
  public optionsTable: IOptionTable[] = [
    {
      name: 'document',
      text: 'Doucmento',
      typeField: 'text',
    },
    {
      name: 'full_name',
      text: 'Nombre',
      typeField: 'text',
    },
    {
      name: 'phone',
      text: 'Telefono',
      typeField: 'text',
    },
    {
      name: 'email',
      text: 'Correo electrónico',
      typeField: 'text',
      classTailwind: 'hover:underline text-primary-500',
    },
    {
      name: 'state',
      text: 'estado',
      typeField: 'text',
    },
    {
      name: 'score',
      text: 'puntaje',
      typeField: 'text',
    },
  ];
  public displayedColumns: string[] = [
    ...this.optionsTable.map(({ name }) => name),
  ];
  private listPermission: NgxPermissionsObject;
  private unsubscribe$ = new Subject<void>();
  private permissionValid: { [key: string]: string } = {
    addUser: 'administracion:usuarios:create',
    updateUser: 'administracion:usuarios:update',
    deleteUser: 'administracion:usuarios:delete',
  };

  constructor(
    private toastAlert: ToastAlertService,
    private fb: FormBuilder,
    private usersService: UsersService,


  ) {

    this.buildForm();

    }

  // ngOnChanges(changes: SimpleChanges): void {
  //   throw new Error('Method not implemented.');
  // }

  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {
    this.readDataUser();
  }


  public addUserForm(): void {

    this.opened = true;
    this.userDataUpdate = null;

  }

  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

  public selectUserTable(dataUser: any): void {
    this.userDataUpdate = { ...dataUser };
    this.opened = true;
  }



  public closeForm(): void {
    this.emitCloseForm.emit();
    this.editMode = false;
    this.dataUpdate = null;
    this.formUser.reset();
  }


  /**
   * @description: Definicion del formulario reactivo
   */
  private buildForm(): void {
    this.formUser = this.fb.group({
      user_login: ['',],
      password_digest: ['',],
      confirm_password: ['',],
      user_profile_id: ['',],
      Email: ['',],
      indicative: ['+57',],
      full_name: ['',],
      Phone: ['',],
      address: [''],
      condition:[''],
      Score:[''],
      Score_telecommunications:[''],
    },

    );

    // this.changeControlsForm();
  }

  private readDataUser(): void {
    this.usersService
      .getUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.subTitlePage = data
          ? `${data.length} Cliente`
          : 'Sin clientes vinculados';
        this.userData = [...(data || [])];
      });
  }










}
