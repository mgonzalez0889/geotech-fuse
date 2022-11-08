import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  /**
   * Constructor
   */
  constructor(
    private dateAdapter: DateAdapter<any>,
    private paginatorIntl: MatPaginatorIntl,
  ) {
    this.dateAdapter.setLocale('es');
    this.paginatorIntl.itemsPerPageLabel = 'Items por página:';
    this.paginatorIntl.firstPageLabel = 'Página anterior';
    this.paginatorIntl.previousPageLabel = 'Pagina anterior';
    this.paginatorIntl.nextPageLabel = 'Siguiente página';
    this.paginatorIntl.lastPageLabel = 'Última página';
  }
}
