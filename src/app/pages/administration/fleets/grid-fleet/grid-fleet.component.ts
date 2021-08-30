import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FleetsService} from '../../../../core/services/fleets.service';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HelperService} from '../../../../core/services/helper.service';
import {DialogAlertEnum} from '../../../../core/interfaces/fuse-confirmation-config';

@Component({
    selector: 'app-grid-fleet',
    templateUrl: './grid-fleet.component.html',
    styleUrls: ['./grid-fleet.component.scss'],

})
export class GridFleetComponent implements OnInit {

    public fleet$: Observable<any>;
    public show: string = 'FLEET';

    constructor(
        private _fleetService: FleetsService,
        private _snackBar: MatSnackBar,
        private helperService: HelperService
    ) {
    }

    ngOnInit(): void {
        this.showFleets();
    }
    /**
     * @description: Abre/cierra el formulario flota
     */
    public openForm(): void {
        this.show = 'FORM';
        this._fleetService.behaviorSubjectFleet$.next({type: 'NEW', isEdit: false});
    }
    public closeForm(value: string): void {
        this.show = value;
    }
    /**
     * @description: Edita un contacto
     */
    public onEdit(id: number): void {
        this.show = 'FORM';
        this.getEditFleet(id);
    }
    /**
     * @description: Elimina una flota del listado
     */
    public onDelete(id: number): void {
        this.helperService.showDialogAlertOption({
            title: 'Eliminar registro',
            text: '¿Desea eliminar la flota?',
            type: DialogAlertEnum.question,
            showCancelButton: true,
            textCancelButton: 'No',
            textConfirButton: 'Si'
        }).then(
            (result) => {
                if (result.value) {
                    this.deleteFleets(id);
                }
            }
        );
    }
    /**
     * @description: Abre la grilla opciones de flotas
     */
    public onOptionFleet(id: number): void {
        this.show = 'OPTIONS';
        this._fleetService.behaviorSubjectUserOwnerPlateFleet$.next({id});
    }
    /**
     * @description: Mostrar todas las flotas
     */
    private showFleets(): void {
        this.fleet$ = this._fleetService.getFleets();
    }
    /**
     * @description: Mostrar informacion de una sola flota
     */
    private getEditFleet(id: number): void {
        this._fleetService.getFleet(id).subscribe(({data}) => {
            this._fleetService.behaviorSubjectFleet$.next({type: 'EDIT', id, isEdit: true, payload: data});
        });
    }
    /**
     * @description: Eliminar una flota
     */
    private deleteFleets(id: number): void {
        this._fleetService.deleteFleets(id).subscribe(
            ()=>{
            this.fleet$ = this._fleetService.getFleets();
            this._snackBar.open('Se ha eliminado la flota','CERRAR',{duration: 4000});
        });
    }

}
