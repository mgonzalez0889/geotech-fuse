import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../../core/services/users.service';
import { IOptionTable } from '../../../../core/interfaces/components/table.interface';

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
  private subscription$: Subscription;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.subscription$ = this.usersService.getUsers().subscribe(({ data }) => {
      this.subTitlePage = data
        ? `${data.length} Usuarios`
        : 'Sin usuarios';
      this.userData = [...data];
    });
  }

  ngOnDestroy(): void {
    this.subscription$?.unsubscribe();
  }

  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataTableUser.filter = filterValue.trim().toLowerCase();
  }
}
