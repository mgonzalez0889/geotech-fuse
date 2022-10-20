import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfilesService } from 'app/core/services/profiles.service';
import { Subscription } from 'rxjs';
import { IOptionTable } from '../../../../core/interfaces/components/table.interface';

@Component({
    selector: 'app-grid-profile',
    templateUrl: './grid-profile.component.html',
    styleUrls: ['./grid-profile.component.scss'],
})
export class GridProfileComponent implements OnInit, OnDestroy {
    public titlePage: string = 'Gestion de perfiles';
    public subTitlepage: string = '';
    public opened: boolean = false;
    public subscription: Subscription;
    public profileCount: number = 0;
    public dataFilter: string = '';
    public columnsProfile: string[] = ['name', 'description'];
    public profileData: any[] = [];
    public optionsTable: IOptionTable[] = [
        {
            name: 'name',
            text: 'Nombre',
        },
        {
            name: 'description',
            text: 'Descripción',
        },
    ];

    constructor(private profileService: ProfilesService) {}

    ngOnInit(): void {
        this.getProfiles();
        this.listenObservables();
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataFilter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Buscar los perfiles de ese cliente
     */
    public getProfiles(): void {
        this.profileService.getProfiles().subscribe((res) => {
            this.subTitlepage = res.data
                ? `${res.data.length} perfiles`
                : 'Sin perfiles';

            this.profileCount = res.data ? res.data.length : 0;
            this.profileData = res.data;
        });
    }
    /**
     * @description: Crear un nuevo perfil
     */
    public newMenu(): void {
        this.opened = true;
        this.profileService.behaviorSubjectProfileForm.next({
            newProfile: 'Nuevo perfil',
        });
    }
    /**
     * @description: Guarda la data del menu para aburirlo en el formulario
     */
    public actionSelectTable(data: any): void {
        this.opened = true;
        this.profileService.behaviorSubjectProfileForm.next({
            payload: data,
            isEdit: false,
        });
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription =
            this.profileService.behaviorSubjectProfileGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getProfiles();
                    }
                }
            );
    }
}
