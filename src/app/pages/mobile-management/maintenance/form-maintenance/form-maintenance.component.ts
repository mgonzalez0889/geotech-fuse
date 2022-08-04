import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MobileService} from "../../../../core/services/mobile.service";

@Component({
    selector: 'app-form-maintenance',
    templateUrl: './form-maintenance.component.html',
    styleUrls: ['./form-maintenance.component.scss']
})
export class FormMaintenanceComponent implements OnInit {
    public form: FormGroup;
    public mobiles = [];
    public mobileList;

    constructor(
        private fb: FormBuilder,
        private _mobilesService: MobileService
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.getMobiles();
    }

    private createForm(): void {
        this.form = this.fb.group({
            sms: this.fb.array([''])
        });
    }

    public addSms(): void {
        this.smsArray.push(this.fb.control(''));
    }

    public removeSms(id: number) {
        this.smsArray.removeAt(id);
    }

    get smsArray(): FormArray {
        return this.form.get('sms') as FormArray;
    }

    /**
     * @description: Obtiene un listado de los vehiculos del cliente
     */
    private getMobiles(): void {
        this._mobilesService.getMobiles().subscribe(({data}) => {
            data.forEach((x) => {
                this.mobiles.push(x.plate);
            });
            this.mobileList = this.mobiles;
        });
    }

    /**
     * @description: Recibe el valor escrito en el buscador
     */
    public keyword(value): void {
        this.mobileList = this.searchMobile(value);
    }

    /**
     * @description: Realiza el filtro
     */
    private searchMobile(value: string) {
        const filter = value.toLowerCase();
        return this.mobiles.filter(option =>
            option.toLowerCase().includes(filter)
        );
    }

}
