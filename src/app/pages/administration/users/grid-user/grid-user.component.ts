import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../../core/services/users.service';
import { IOptionTable } from '../../../../core/interfaces/components/table.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-grid-user',
  templateUrl: './grid-user.component.html',
  styleUrls: ['./grid-user.component.scss'],
})
export class GridUserComponent implements OnInit, OnDestroy {
  public opened: boolean = false;
  public titlePage: string = 'Usuarios';
  public subTitlePage: string = '';
  public userData: any[] = [];
  public dataFilter: string = '';
  public titleForm: string = '';
  public userDataUpdate: any = null;
  public optionsTable: IOptionTable[] = [
    {
      name: 'user_login',
      text: 'Usuario',
      typeField: 'text'
    },
    {
      name: 'full_name',
      text: 'Nombre',
      typeField: 'text'
    },
    {
      name: 'profile',
      text: 'Perfil',
      typeField: 'text'
    },
    {
      name: 'email',
      text: 'Correo electrónico',
      typeField: 'text',
      classTailwind: 'hover:underline text-primary-500'
    }
  ];

  public displayedColumns: string[] = [...this.optionsTable.map(({ name }) => name)];
  private unsubscribe$ = new Subject<void>();

  constructor(private usersService: UsersService, private confirmationService: ConfirmationService, private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.readDataUser();
    this.listenFormUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public newUser(): void {
    this.opened = true;
    this.titleForm = 'Crear usuario';
    this.userDataUpdate = null;
  }
  public selectUser(dataUser: any): void {
    this.userDataUpdate = { ...dataUser };
    this.opened = true;
    this.titleForm = 'Editar usuario';
  }

  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

  private readDataUser(): void {
    this.usersService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(({ data }) => {
      this.subTitlePage = data
        ? `${data.length} Usuarios`
        : 'Sin usuarios';
      this.userData = [...data];
    });
  }

  private listenFormUser(): void {
    this.usersService.userForm$.pipe(takeUntil(this.unsubscribe$)).subscribe(({ formData, typeAction }) => {
      if (typeAction === 'add') {
        this.usersService.postUser(formData).subscribe(() => {
          this.readDataUser();
          this._snackBar.open('Se ha creado el nuevo usuario', 'CERRAR', { duration: 4000 });
        });
      } else if (typeAction === 'edit') {
        this.usersService.putUser(formData).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
          this.readDataUser();
          this._snackBar.open('Usuario actualizado con exito', 'CERRAR', { duration: 4000 });
        });
      } else if (typeAction === 'delete') {
        const confirmation = this.confirmationService.open();
        confirmation.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
          if (result === 'confirmed') {
            this.usersService.deleteUser(formData.id).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
              this._snackBar.open('Usuario Eliminado con exito', 'CERRAR', { duration: 4000 });
              this.readDataUser();
              this.opened = false;
            });
          }
        });
      }
    });
  }

}
