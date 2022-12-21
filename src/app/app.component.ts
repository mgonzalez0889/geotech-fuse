import moment from 'moment';
import { delay } from 'rxjs/operators';
import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslocoService } from '@ngneat/transloco';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { NavigationService } from '@services/navigation/navigation.service';

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
  ) {
    this.traslatePagination();
  }

  traslatePagination(): void {
    this.translocoService.langChanges$
      .pipe(delay(100))
      .subscribe((locale) => {
        this.dateAdapter.setLocale(locale);
        moment.locale(locale);
        const { pagination } = this.translocoService.translateObject('table');
        this.paginatorIntl.itemsPerPageLabel = pagination.itemsPerPageLabel;
        this.paginatorIntl.firstPageLabel = pagination.firstPageLabel;
        this.paginatorIntl.previousPageLabel = pagination.previousPageLabel;
        this.paginatorIntl.nextPageLabel = pagination.lastPageLabel;
        this.paginatorIntl.lastPageLabel = pagination.nextPageLabel;
      });
  }
}
