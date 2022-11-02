import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /**
   * Constructor
   */
  constructor(
    private permissionsService: NgxPermissionsService,
    private dateAdapter: DateAdapter<any>,
    private paginatorIntl: MatPaginatorIntl
  ) {

    this.dateAdapter.setLocale('es');
    this.paginatorIntl.itemsPerPageLabel = 'Items por página:';
    this.paginatorIntl.firstPageLabel = 'Página anterior';
    this.paginatorIntl.previousPageLabel = 'Pagina anterior';
    this.paginatorIntl.nextPageLabel = 'Siguiente página';
    this.paginatorIntl.lastPageLabel = 'Última página';
  }

  ngOnInit(): void {
    // const role = 'admin';
    // console.log('hola');

    // const permission = ['perm1', 'perm2', 'perm3'];
    // this.permissionsService.addPermission(permission, (permissionName, permissionsObject) => {

    //   console.log(permissionName, permissionsObject);

    //   return true;
    // });

    // this.permissionsService.permissions$.subscribe(console.log);
  }

  permissionPrueba(): void {
    // console.log('me entro');

  }
}
