import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { NavigationService } from 'app/core/services/navigation/navigation.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { UserService } from 'app/core/user/user.service';
import { FleetsService } from './core/services/api/fleets.service';
import { MobileService } from '@services/api/mobile.service';

@Injectable({
  providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any>
{
  /**
   * Constructor
   */
  constructor(
    private _messagesService: MessagesService,
    private _navigationService: NavigationService,
    private _notificationsService: NotificationsService,
    private _shortcutsService: ShortcutsService,
    private _userService: UserService,
    private fleetService: FleetsService,
    private mobilesService: MobileService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Use this resolver to resolve initial mock-api for the application
   *
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
      this._navigationService.get(),
      this._userService.get(),
      this._messagesService.getAll(),
      this._notificationsService.getAll(),
      this._shortcutsService.getAll(),
      this.fleetService.getFleets(),
      this.mobilesService.getMobiles()
    ]);
  }
}
