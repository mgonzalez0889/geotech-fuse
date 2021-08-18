import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ContactService} from 'app/core/services/contact.service';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDeleteComponent} from "../../../../shared/dialogs/confirm-delete/confirm-delete.component";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";

@Component({
    selector: 'app-grid-contact',
    templateUrl: './grid-contact.component.html',
    styleUrls: ['./grid-contact.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class GridContactComponent implements OnInit, OnDestroy {

    public show: boolean = false;
    public contacts$: Observable<any>;

    constructor(
        private _contactService: ContactService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.showContact();
    }
    /**
     * @description: Abre/cierra el formulario
     */
    public openForm(): void {
        this.show = true;
        this._contactService.behaviorSubjectContact$.next({type: 'NEW', isEdit: false});
    }
    public closeForm(value): void {
        this.show = value;
    }
    /**
     * @description: Edita un contacto
     */
    public onEdit(id: number): void {
        this.show = true;
        this.getEditContct(id);
    }
    /**
     * @description: Mostrar todos los contactos
     */
    public showContact(): void {
        this.contacts$ = this._contactService.getContacts();
    }
    /**
     * @description: Mostrar informacion de un contacto
     */
    private getEditContct(id: number): void {
        this._contactService.getContact(id).subscribe(({data}) => {
            this._contactService.behaviorSubjectContact$.next({type: 'EDIT', id, isEdit: true, payload: data});
        });
    }
    /**
     * @description: Eliminar un contacto
     */
    public deleteContact(id: number): void {
        this._contactService.deleteContacts(id).subscribe(
            (res) => {
                this.contacts$ = this._contactService.getContacts();
                this._snackBar.open('Se ha eliminado el contacto', 'CERRAR', {duration: 4000});
                console.log('Elemento eliminado');
            });
    }
    ngOnDestroy(): void {
     }


}
