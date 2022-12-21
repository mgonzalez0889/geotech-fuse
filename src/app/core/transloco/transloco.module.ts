import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoModule,
  TranslocoService,
} from '@ngneat/transloco';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslocoHttpLoader } from 'app/core/transloco/transloco.http-loader';
import { isDevMode } from '@angular/core';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      // Provide the default Transloco configuration
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: [
          {
            id: 'es',
            label: 'Español',
          },
          {
            id: 'en',
            label: 'English',
          },
        ],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      }),
    },
    {
      // Provide the default Transloco loader
      provide: TRANSLOCO_LOADER,
      useClass: TranslocoHttpLoader,
    },
    {
      // Preload the default language before the app starts to prevent empty/jumping content
      provide: APP_INITIALIZER,
      deps: [TranslocoService],
      useFactory:
        (translocoService: TranslocoService): any =>
          (): Promise<Translation> => {
            const defaultLang = translocoService.getDefaultLang();
            // const locale = window.navigator.language.slice(0, 2);
            const locale = localStorage.getItem('language');
            let loadLang: string;
            if (locale === 'es' || locale === 'en') {
              loadLang = locale;
              translocoService.setActiveLang(locale);
            } else {
              loadLang = defaultLang;
              translocoService.setActiveLang(defaultLang);
            }

            return translocoService.load(loadLang).toPromise();
          },
      multi: true,
    },
  ],
})
export class TranslocoCoreModule { }
