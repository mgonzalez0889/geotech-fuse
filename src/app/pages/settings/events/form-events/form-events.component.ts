import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { EventsService } from 'app/core/services/events.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-events',
    templateUrl: './form-events.component.html',
    styleUrls: ['./form-events.component.scss'],
})
export class FormEventsComponent implements OnInit, OnDestroy {
    public events: any = [];
    public contacts: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public eventForm: FormGroup;
    public subscription: Subscription;

    constructor(
        private eventsService: EventsService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.createEventsForm();
        this.listenObservables();
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    /**
     * @description: Formulario de modulo eventos
     */
    private createEventsForm(): void {
        this.eventForm = this.fb.group({
            id: [''],
            name: ['', [Validators.required]],
            color: ['', [Validators.required]],
            description: ['', [Validators.required]],
        });
    }
    /**
     * @description: Escucha el observable behavior y busca al contacto
     */
    private listenObservables(): void {
        this.subscription =
            this.eventsService.behaviorSubjectEventForm.subscribe(
                ({ id, isEdit }) => {
                    this.editMode = isEdit;
                    if (id) {
                        this.eventsService.getEvent(id).subscribe((res) => {
                            this.events = res.data;
                            console.log(this.events,'events[')
                            this.eventForm.patchValue(this.events);
                        });
                    }
                }
            );
    }
}
