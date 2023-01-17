/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { UsersService } from 'app/core/services/api/users.service';
import { AuthService } from 'app/core/auth/auth.service';

interface IUserInfo {
  id: number;
  owner: number;
  user_login: string;
  address: string;
  email: string;
  full_name: string;
  lenguage: string;
  owner_id_simulator: number;
  phone: string;
  status: boolean;
  time_zone: string;
  user_profile_id: number;
  owner_name: string;
}

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
  static ngAcceptInputType_showAvatar: BooleanInput;

  @Input() showAvatar: boolean = true;
  public infoUser: IUserInfo;
  user: User;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _userService: UserService,
    private userService: UsersService,
    private authService: AuthService
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.getInfoUser();
    // Subscribe to user changes
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Update the user status
   *
   * @param status
   */
  updateUserStatus(status: string): void {
    if (!this.user) {
      return;
    }

    this._userService
      .update({
        ...this.user,
        status,
      })
      .subscribe();
  }

  /**
   * Sign out
   */
  signOut(): void {
    this._router.navigate(['/sign-out']);
  }

  /**
   * @description: Trae la informacion del usuario
   */
  public getInfoUser(): void {
    this.userService.getInfoUser().subscribe((res) => {
      this.infoUser = res.data;
      localStorage.setItem('language', this.infoUser.lenguage);
      localStorage.setItem('infoUser', JSON.stringify(this.infoUser));
      this.authService.assingPermission();
    });
  }
}
