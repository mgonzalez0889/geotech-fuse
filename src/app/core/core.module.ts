import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthModule } from 'app/core/auth/auth.module';
import { IconsModule } from 'app/core/icons/icons.module';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ConfirmationModule } from './services/confirmation/confirmation.module';

@NgModule({
  imports: [
    AuthModule,
    IconsModule,
    TranslocoCoreModule,
    ConfirmationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
  ]
})
export class CoreModule {
  /**
   * Constructor
   */
  constructor(
    @Optional() @SkipSelf() parentModule?: CoreModule
  ) {
    // Do not allow multiple injections
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.');
    }
  }
}
