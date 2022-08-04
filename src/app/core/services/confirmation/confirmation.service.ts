import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';
import { ConfirmationConfig } from './confirmation';
import { DialogComponent } from './dialog/dialog.component';

@Injectable()
export class ConfirmationService {
    private _defaultConfig: ConfirmationConfig = {
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
    constructor(private _matDialog: MatDialog) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    open(config: ConfirmationConfig = {}): MatDialogRef<DialogComponent> {
        // Merge the user config with the default config
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
