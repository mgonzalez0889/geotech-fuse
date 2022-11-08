import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Navigation } from 'app/core/interfaces/services/navigation.interface';
import { AppSettingsService } from '../../app-configs/app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _navigation: ReplaySubject<Navigation> =
    new ReplaySubject<Navigation>(1);

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _appSettings: AppSettingsService
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for navigation
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all navigation data
   */
  //   get(): Observable<Navigation>
  // {
  //     return this._httpClient.get<Navigation>('api/common/navigation').pipe(
  //         tap((navigation) => {
  //             this._navigation.next(navigation);
  //         })
  //     );
  // }
  get(): Observable<Navigation> {

    const params = { method: 'show_menu_user' };
    let navigations: any = {
      compact: [],
      default: [],
      futuristic: [],
      horizontal: [],
    };
    return this._httpClient
      .get<Navigation>(this._appSettings.menuOptions.url.optionsFather, {
        params,
      })
      .pipe(
        tap((navigation) => {
          navigations = {
            default: navigation,
            compact: navigation,
            futuristic: navigation,
            horizontal: navigation,
          };

          this._navigation.next(navigations);
        })
      );
  }
}
