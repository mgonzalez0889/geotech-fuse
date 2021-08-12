import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "../../../../core/services/contact.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-form-contact',
    templateUrl: './form-contact.component.html',
    styleUrls: ['./form-contact.component.scss']
})
export class FormContactComponent implements OnInit {

    public formContacts: FormGroup;
    id: string;


    constructor(private fb: FormBuilder, private _contactService: ContactService, private router: Router, private aRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.createContactForm();
        this.id = this.aRoute.snapshot.paramMap.get('id');
    }

    /***
     * @description: Creacion de los datos del formulario de contactos
     */
    private createContactForm(): void {
        this.formContacts = this.fb.group({
                id: undefined,
                full_name: ['', [Validators.required]],
                identification: ['', [Validators.required]],
                email: ['', [Validators.required]],
                cell_phone: ['', [Validators.required]],
                address: ['', [Validators.required]]
            }
        );
    }
    /**
     * @description: Guardar o eliminar un nuevo contacto
     */
    public SaveOrEdit(): void {
        if (!this.id) {
            this.newContact();
        } else {
            this.editContact(this.id);
        }
    }
    /**
     * @description: Crear un nuevo contacto
     */
    private newContact(): void {
        this._contactService.postContacts(this.formContacts.value).subscribe((res) => {
            console.log(res);
            this.router.navigate(['/default/administration/contacts']);
        });
    }

    /**
     * @description: Editar contacto
     */
    private editContact(id: string): void {
        this._contactService.putContacts(id, this.formContacts.value).subscribe(
            res => this.router.navigate(['/default/administration/contacts'])
        );
    }

}
