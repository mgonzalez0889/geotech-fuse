import { Component, OnInit } from '@angular/core';
import { IOptionTable } from '@interface/index';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalLinkageComponent } from '../modal-linkage/modal-linkage.component';
import { MatDialog } from '@angular/material/dialog';
import { LinkageService } from '../../../../core/services/api/linkage.service';

@Component({
  selector: 'app-grid-linkage',
  templateUrl: './grid-linkage.component.html',
  styleUrls: ['./grid-linkage.component.scss']
})
export class GridLinkageComponent implements OnInit {
  public titlePage: string = 'Vinculación';
  public subTitlePage: string = 'Contrato Clientes';
  public titleForm: string = '';
  public opened: boolean = false;
  public userData: any[] = [];
  public dataFilter: string = '';
  public userDataUpdate: any = null;
  public showModal = false;
  public animal: string;
  public name: string;
  public optionsTable: IOptionTable[] = [
    {
      name: 'user_login',
      text: 'Documento',
      typeField: 'text',
    },
    {
      name: 'full_name',
      text: 'Nombre',
      typeField: 'text',
    },
    {
      name: 'profile',
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
      name: 'enable_user',
      text: 'Estado',
      typeField: 'text',
    },
  ];

  public displayedColumns: string[] = [
    ...this.optionsTable.map(({ name }) => name),
  ];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private matDialog: MatDialog,
    private linkageService: LinkageService
  ) { }

  ngOnInit(): void {
    this.readDataUser();
  }

  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

  public addUserForm(): void {
    this.opened = true;
    this.titleForm = 'Crear cliente';
    this.userDataUpdate = null;
  }

  public selectUserTable(dataUser: any): void {
    this.userDataUpdate = { ...dataUser };
    this.opened = true;
    this.titleForm = 'Editar cliente';

  }
  public newClient(): void {
    const dialogRef = this.matDialog.open(ModalLinkageComponent, {
      width: '500px',
      height: '430px',
    });
  }

  private readDataUser(): void {
    this.linkageService
      .getUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.subTitlePage = data
          ? `${data.length} Clientes vinculados`
          : 'Sin clientes vinculados';
        this.userData = [...(data || [])];
      });
  }
}
