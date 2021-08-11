import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "../../../../core/services/contact.service";
import {data} from "autoprefixer";

@Component({
    selector: 'app-form-contact',
    templateUrl: './form-contact.component.html',
    styleUrls: ['./form-contact.component.scss']
})
export class FormContactComponent implements OnInit {

    public formContacts: FormGroup;


    constructor(private fb: FormBuilder, private _contactService: ContactService) {
    }

    ngOnInit(): void {
    }

    /***
     * @description: Creacion de los datos del formulario de contactos
     */
    private createContactForm(): void {
        this.formContacts = this.fb.group({
            id: undefined,
            name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            identification_number:['',[Validators.required]],
            email: ['', [Validators.required]],
            cell_phone: ['', [Validators.required]],
            address:['',[Validators.required]]
        }
        );
    }

    /**
     * @description: Crear un nuevo contacto
     */
    private newContact(): void{
        this._contactService.postContacts(this.formContacts.value).subscribe((res)=>{
            console.log(res);
        });
    }

    /***
     * @description: Editar contacto
     */
    private editContact(): void{

    }

}
