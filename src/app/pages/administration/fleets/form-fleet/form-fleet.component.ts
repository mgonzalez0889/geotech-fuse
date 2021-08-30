import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {FleetsService} from "../../../../core/services/fleets.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-form-fleet',
    templateUrl: './form-fleet.component.html',
    styleUrls: ['./form-fleet.component.scss']
})
export class FormFleetComponent implements OnInit, OnDestroy {
    @Output() onShow: EventEmitter<string> = new EventEmitter<string>();
    public formFleets: FormGroup;
    public subscription$: Subscription;
    public titleForm: string;
    public id: string;

    constructor(
        private fb: FormBuilder,
        private _fleetService: FleetsService,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit(): void {
        this.createFleetsForm();
        this.listenObservables();
    }

    /**
     * @description: Crear o editar una nueva flota
     */
    public onSave(): void {
        const data = this.formFleets.getRawValue();
        if (!data.id) {
            this.newFleet(data);
        } else {
            this.editFleet(data);
        }
    }
    /**
     * @description: Cierra formulario
     */
    public onClose(): void {
        this.onShow.emit('FLEET');
    }

    /***
     * @description: Creacion de los datos del formulario de flota
     */
    private createFleetsForm(): void {
        this.formFleets = this.fb.group({
            id: undefined,
            name: ['', [Validators.required]],
            description: ['', [Validators.required]]
        });
    }
    /***
     * @description: Crear una nueva flota
     */
    private newFleet(data: any): void {
        this.subscription$ = this._fleetService.postFleets(data).subscribe(() => {
            this._snackBar.open('La flota ha sido creada con exito', 'CERRAR', {duration: 4000});
            this.onShow.emit('FLEET');
        });
    }
    /***
     * @description: Editar una flota
     */
    private editFleet(data: any): void{
        this.subscription$ = this._fleetService.putFleets(data).subscribe(()=>{
            this._snackBar.open('La flota ha sido actualizada', 'CERRAR', {duration: 4000});
            this.onShow.emit('FLEET');
        });
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription$ = this._fleetService.behaviorSubjectFleet$.subscribe(({ type, isEdit, payload }) => {
            if (isEdit && type == 'EDIT') {
                this.formFleets.patchValue(payload);
                this.titleForm = `Editar flota ${payload.name}`;
            } else if (!isEdit && type == 'NEW') {
                this.formFleets.reset({
                });
                this.titleForm = 'Nueva flota';
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
