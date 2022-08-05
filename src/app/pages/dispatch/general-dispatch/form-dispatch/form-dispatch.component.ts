import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'app/core/services/fuse-confirmation.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-dispatch',
    templateUrl: './form-dispatch.component.html',
    styleUrls: ['./form-dispatch.component.scss'],
})
export class FormDispatchComponent implements OnInit {
    public dispath: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public dispathForm: FormGroup;
    public subscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.listenObservables();
        this.createContactForm();
    }
    /**
     * @description: Valida si es edita o guarda un contacto nuevo
     */
    public onSave(): void {
        const data = this.contactForm.getRawValue();
        if (!data.id) {
            this.newContact(data);
        } else {
            this.editContact(data);
        }
    }
}
