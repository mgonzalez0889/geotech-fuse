import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from "rxjs";
import {EventsService} from "../../../../core/services/events.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-form-events',
    templateUrl: './form-events.component.html',
    styleUrls: ['./form-events.component.scss']
})
export class FormEventsComponent implements OnInit, OnDestroy {

    @Output() onShow: EventEmitter<boolean> = new EventEmitter<boolean>();
    public formEvents: FormGroup;
    public subscription$: Subscription;

    constructor(
        private fb: FormBuilder,
        private _eventsServices: EventsService,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit(): void {
        this.listenObservables();
        this.createEventsForm();
    }

    /**
     * @description: Cierra formulario
     */
    public onClose(): void {
        this.onShow.emit(false);
    }
    /**
     * @description: Formulario de modulo eventos
     */
    private createEventsForm(): void {
        this.formEvents = this.fb.group({
            id: undefined,
            name: ['',[Validators.required]],
            color: ['',[Validators.required]],
            description: ['',[Validators.required]],
            checkNotificationEmail: [''],
        });
    }

    /**
     * @description: Editar un evento
     */
    public editEvent(): void {
        const data = this.formEvents.getRawValue();
        this.subscription$ = this._eventsServices.putEvents(data).subscribe(() => {
            this._snackBar.open('Evento actualizado con exito', 'CERRAR', {duration: 4000});
            this.onShow.emit(false);
        });
    }

    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription$ = this._eventsServices.behaviorSubjectEvents$.subscribe(({type, isEdit, payload}) => {
            if (isEdit && type == 'EDIT') {
                this.formEvents.patchValue(payload);
            }
        });
    }
    /**
     * @description: Destruye las subscripciones
     */
    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }
}
