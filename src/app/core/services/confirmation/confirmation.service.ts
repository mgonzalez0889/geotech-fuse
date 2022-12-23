import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IConfirmationModal } from 'app/core/interfaces';
import { merge } from 'lodash-es';
import { DialogComponent } from './dialog/dialog.component';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class ConfirmationService {
  private _defaultConfig: IConfirmationModal = {
    title: 'Confirmar acción',
    message: '¿Estás seguro de que quieres confirmar esta acción?',
    icon: {
      show: true,
      name: 'heroicons_outline:exclamation',
      color: 'warn',
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirmar',
        color: 'warn',
      },
      cancel: {
        show: true,
        label: 'Cancelar',
      },
    },
    dismissible: false,
  };

  /**
   * Constructor
   */
  constructor(private _matDialog: MatDialog, private translocoService: TranslocoService) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  open(config: IConfirmationModal = {}): MatDialogRef<DialogComponent> {
    // Merge the user config with the default config
    const { messageConfirm, messageTitleConfirm } = this.translocoService.translateObject('messageAlert');
    const messageClose = this.translocoService.translate('buttons.buttonClose');
    const messageButtonConfirm = this.translocoService.translate('buttons.buttonConfirm');

    this._defaultConfig.message = messageConfirm;
    this._defaultConfig.title = messageTitleConfirm;
    this._defaultConfig.actions.confirm.label = messageButtonConfirm;
    this._defaultConfig.actions.cancel.label = messageClose;

    const userConfig = merge({}, this._defaultConfig, config);

    // Open the dialog
    return this._matDialog.open(DialogComponent, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: 'cconfirmation-dialog-panel',
    });
  }
}
