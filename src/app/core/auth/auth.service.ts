import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { NgxPermissionsObject, NgxPermissionsService } from 'ngx-permissions';

@Injectable()
export class AuthService {
  public _authenticated: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _appSettings: AppSettingsService,
    private permissionService: NgxPermissionsService
  ) {
  }

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  //permission
  get permissionList(): Observable<NgxPermissionsObject> {
    return this.permissionService.permissions$
      .pipe(
        filter(data => Object.keys(data).length !== 0),
      );
  }

  getUserPermission(idProfile: number): Observable<any> {
    const params = { method: 'show_user_profile' };
    return this._httpClient.get(`${this._appSettings.profile.url.base}/${idProfile}`, { params });
  }

  assingPermission(): void {
    const profile = JSON.parse(localStorage.getItem('infoUser'));
    this.getUserPermission(profile.user_profile_id).subscribe(({ data }) => {
      this.permissionService.addPermission(data.permission);
    });
  }

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { user: string; password: string; client_id: string; client_secret: string; grant_type: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError('User is already logged in.');
    }

    return this._httpClient.post(this._appSettings.auth.url.base, credentials).pipe(
      switchMap((response: any) => {
        this.accessToken = response.access_token;
        this._authenticated = true;
        this._userService.user = response.user;
        return of(response);
      })
    );
  }

  /**
   * Sign in using the access token
   */
  signInUsingToken(): Observable<any> {
    // Renew token
    return this._httpClient.post('api/auth/refresh-access-token', {
      accessToken: this.accessToken
    }).pipe(
      catchError(() =>

        // Return false
        of(false)
      ),
      switchMap((response: any) => {

        // Store the access token in the local storage
        this.accessToken = response.accessToken;

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this._userService.user = response.user;

        // Return true
        return of(true);
      })
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('infoUser');

    // Set the authenticated flag to false
    const count = timer(500);
    count.subscribe(() => {
      this._authenticated = false;
    });

    // Return the observable
    return of(true);
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
    return this._httpClient.post('api/auth/sign-up', user);
  }

  /**
   * Unlock session
   *
   * @param credentials
   */
  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    // If the access token exists and it didn't expire, sign in using it
    return this.signInUsingToken();
  }
}
