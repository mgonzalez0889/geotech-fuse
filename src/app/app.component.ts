import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@ngneat/transloco';
import { delay } from 'rxjs/operators';
import { DateTools } from './core/tools/date.tool';

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
    private translocoService: TranslocoService,
    private dateTool: DateTools
  ) {
    this.dateAdapter.setLocale('en');
    this.traslatePagination();
  }

  traslatePagination(): void {
    this.translocoService.langChanges$
      .pipe(delay(100))
      .subscribe((locale) => {
        // this.dateTool.setLocale('a');
        const { pagination, } = this.translocoService.translateObject('table');
        this.paginatorIntl.itemsPerPageLabel = pagination.itemsPerPageLabel;
        this.paginatorIntl.firstPageLabel = pagination.firstPageLabel;
        this.paginatorIntl.previousPageLabel = pagination.previousPageLabel;
        this.paginatorIntl.nextPageLabel = pagination.lastPageLabel;
        this.paginatorIntl.lastPageLabel = pagination.nextPageLabel;
      });
  }
}
