import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProfilesService } from 'app/core/services/profiles.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-profile',
    templateUrl: './grid-profile.component.html',
    styleUrls: ['./grid-profile.component.scss'],
})
export class GridProfileComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public dataTableProfile: MatTableDataSource<any>;
    public columnsProfile: string[] = ['name', 'description'];
    public subscription: Subscription;
    public opened: boolean = false;
    public profileCount: number = 0;
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
        this.dataTableProfile.filter = filterValue.trim().toLowerCase();
    }
    public getProfiles(): void {
        this.profileService.getProfiles().subscribe((res) => {
            if (res.data) {
                this.profileCount = res.data.length;
            } else {
                this.profileCount = 0;
            }
            this.dataTableProfile = new MatTableDataSource(res.data);
            this.dataTableProfile.paginator = this.paginator;
            this.dataTableProfile.sort = this.sort;
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
    public actionsMenu(data: any): void {
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
