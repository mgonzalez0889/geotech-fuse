import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { MenuOptionsService } from 'app/core/services/menu-options.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-menu-options',
    templateUrl: './form-menu-options.component.html',
    styleUrls: ['./form-menu-options.component.scss'],
})
export class FormMenuOptionsComponent implements OnInit, OnDestroy {
    public options: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public menuForm: FormGroup;
    public subscription: Subscription;
    public typeOptions = [
        {
            id: 0,
            type: 'basic',
            option: 'Basico',
        },
        {
            id: 1,
            type: 'collapsable',
            option: 'Plegable',
        },
        {
            id: 2,
            type: 'divider',
            option: 'División',
        },
    ];
    constructor(
        private menuOptionsService: MenuOptionsService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.listenObservables();
        this.createMenuForm();
    }
    /**
     * @description: Valida si es edita o guarda un contacto nuevo
     */
    public onSave(): void {
        const data = this.menuForm.getRawValue();
        console.log(data, 'final');

        if (!data.id) {
            this.newMenu(data);
        } else {
            // this.editMenu(data);
        }
    }
    /**
     * @description: Cierra el menu lateral de la derecha
     */
    public closeMenu(): void {
        this.menuOptionsService.behaviorSubjectMenuGrid.next({
            opened: false,
            reload: false,
        });
    }
    /**
     * @description: Agrega una nueva opcion
     */
    public addOption(): void {
        const optionFormGroup = this.fb.group({
            type: [],
            title: [],
            subtitle: [],
            icon: [],
            link: [],
            disabled: [],
            badgeSelect: [],
            viewOption: [],
            createOption: [],
            editOption: [],
            deleteOption: [],
            badgeTitle: [],
            badgeClasses: [],
            children: this.fb.array([]),
        });
        (this.menuForm.get('children') as FormArray).push(optionFormGroup);
    }

    public addOptionChildren(index: number): void {
        const childrenFormGroup = this.fb.group({
            type: [],
            title: [],
            subtitle: [],
            icon: [],
            link: [],
            disabled: [],
            badgeSelect: [],
            viewOption: [],
            createOption: [],
            editOption: [],
            deleteOption: [],
            badgeTitle: [],
            badgeClasses: [],
        });
        (
            this.menuForm.get('children.' + index + '.children') as FormArray
        ).push(childrenFormGroup);
    }

    public removeOption(index: number): void {
        const optionFormArray = this.menuForm.get('children') as FormArray;
        optionFormArray.removeAt(index);
    }
    public removeOptionChildren(indexFather: number, iChildren: number): void {
        const optionFormArray2 = this.menuForm.get(
            'children.' + indexFather + '.children'
        ) as FormArray;
        optionFormArray2.removeAt(iChildren);
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    /**
     * @description: Inicializa el formulario de opciones
     */
    private createMenuForm(): void {
        this.menuForm = this.fb.group({
            id: [''],
            type: ['group'],
            title: ['', [Validators.required]],
            subtitle: [''],
            children: this.fb.array([]),
        });
    }
    /**
     * @description: Escucha el observable behavior y busca al contacto
     */
    private listenObservables(): void {
        this.subscription =
            this.menuOptionsService.behaviorSubjectMenuForm.subscribe(
                ({ newOption, id, isEdit }) => {
                    this.editMode = isEdit;
                    if (newOption) {
                        this.options = [];
                        this.options['name'] = newOption;
                        if (this.menuForm) {
                            this.menuForm.reset();
                        }
                    }
                    // if (id) {
                    //     this.optionservice.getContact(id).subscribe((data) => {
                    //         this.options = data.data;
                    //         this.contactForm.patchValue(this.options);
                    //     });
                    // }
                }
            );
    }
    /**
     * @description: Metdo para crear un nuevo menu
     */
    private newMenu(data: any): void {
        this.menuOptionsService.postMenuOption(data).subscribe((res) => {
            console.log(res, 'arturo');
        });
    }
}
