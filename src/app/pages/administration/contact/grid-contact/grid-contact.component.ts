import {Component, OnInit} from '@angular/core';
import {contactData} from 'app/core/interfaces/contact';
import {ContactService} from 'app/core/services/contact.service';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDeleteComponent} from "../../../../shared/dialogs/confirm-delete/confirm-delete.component";

@Component({
    selector: 'app-grid-contact',
    templateUrl: './grid-contact.component.html',
    styleUrls: ['./grid-contact.component.scss'],
})
export class GridContactComponent implements OnInit {

    contactData: contactData[] = [];
    public show: boolean = false;


    constructor(private _contactService: ContactService,public dialog: MatDialog,) {
    }

    ngOnInit(): void {
        this.showContact();
    }

    /**
     * @description: Abre el formulario
     */
    public openForm(): void {
        this.show = true;
        this._contactService.behaviorSubjectContact$.next({type: 'NEW', isEdit: false});
    }

    public closeForm(value): void {
        this.show = value;
    }

    /**
     * @description: Edita un usuario
     */
    public onEdit(id: number): void {
        this.show = true;
        this.getEditContct(id);
    }

    public onDelete(id: number): void {
        const dialog = new MatDialogConfig();
        dialog.data = id;
        dialog.width = '30%';
        dialog.maxWidth = '30%';

        const dialogRef = this.dialog.open(ConfirmDeleteComponent, dialog);

        dialogRef.afterClosed().toPromise().then(() => this.showContact());
    }

    /**
     * @description: Mostrar todos los contactos
     */
    public showContact(): void {
        this._contactService.getContacts().subscribe((res: any) => {
            this.contactData = res.data;
            console.log(res.data);
        });
    }

    /**
     * @description: Eliminar un contacto
     */
    public deleteContact(id: string): void {
        this._contactService.deleteContacts(id).subscribe(
            res => this._contactService.getContacts().subscribe((data: any) => {
                this.contactData = data.data;
                console.log('Elemento eliminado');

            })
        );
    }

    /**
     * @description: Mostrar informacion de un contacto
     */
    private getEditContct(id: number): void {

        this._contactService.getContact(id).subscribe(({data}) => {
            this._contactService.behaviorSubjectContact$.next({type: 'EDIT', id, isEdit: true, payload: data});
        });

    }

}
