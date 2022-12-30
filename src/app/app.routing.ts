import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in',
  },
  //{ path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: '/app/tracking/maps' },
  {
    path: '',
    /*canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],*/
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'confirmation-required',
        loadChildren: (): Promise<any> =>
          import(
            'app/modules/auth/confirmation-required/confirmation-required.module'
          ).then(m => m.AuthConfirmationRequiredModule),
      },
      {
        path: 'forgot-password',
        loadChildren: (): Promise<any> =>
          import(
            'app/modules/auth/forgot-password/forgot-password.module'
          ).then(m => m.AuthForgotPasswordModule),
      },
      {
        path: 'reset-password',
        loadChildren: (): Promise<any> =>
          import(
            'app/modules/auth/reset-password/reset-password.module'
          ).then(m => m.AuthResetPasswordModule),
      },
      {
        path: 'sign-in',
        loadChildren: (): Promise<any> =>
          import('app/modules/auth/sign-in/sign-in.module').then(
            m => m.AuthSignInModule
          ),
      },
      {
        path: 'sign-up',
        loadChildren: (): Promise<any> =>
          import('app/modules/auth/sign-up/sign-up.module').then(
            m => m.AuthSignUpModule
          ),
      },
    ],
  },
  {
    path: '',
    /*canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],*/
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: (): Promise<any> =>
          import('app/modules/auth/sign-out/sign-out.module').then(
            m => m.AuthSignOutModule
          ),
      },
      {
        path: 'unlock-session',
        loadChildren: (): Promise<any> =>
          import(
            'app/modules/auth/unlock-session/unlock-session.module'
          ).then(m => m.AuthUnlockSessionModule),
      },
    ],
  },
  {
    path: '',
    /*canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],*/
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: (): Promise<any> =>
          import('app/modules/admin/example/example.module').then(
            m => m.ExampleModule
          ),
      },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: 'app',
        loadChildren: (): Promise<any> =>
          import('./pages/default.module').then(
            m => m.DefaultModule
          ),
      },
    ],
  },
];
