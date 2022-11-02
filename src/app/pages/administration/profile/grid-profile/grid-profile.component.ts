import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { ProfilesService } from 'app/core/services/profiles.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IOptionTable } from '../../../../core/interfaces/components/table.interface';

interface IListModules {
  id: number;
  title: string;
}
@Component({
  selector: 'app-grid-profile',
  templateUrl: './grid-profile.component.html',
  styleUrls: ['./grid-profile.component.scss'],
})
export class GridProfileComponent implements OnInit, OnDestroy {
  public titlePage: string = 'Gestion de perfiles';
  public titleForm: string = '';
  public subTitlepage: string = '';
  public opened: boolean = false;
  public subscription: Subscription;
  public dataFilter: string = '';
  public profileDataUpdate: any = null;
  public profileData: any[] = [];
  public columnsProfile: string[] = ['name', 'description'];
  public optionsTable: IOptionTable[] = [
    {
      name: 'name',
      text: 'Nombre',
      typeField: 'text',
    },
    {
      name: 'description',
      text: 'Descripción',
      typeField: 'text',
    },
  ];

  public availableModules: IListModules[] = [];
  public assignedModules: IListModules[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private confirmationService: ConfirmationService, private profileService: ProfilesService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProfiles();
    this.listenObservables();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

      this.profileData = res.data;
    });
  }

  /**
   * @description: Crear un nuevo perfil
   */
  public newMenu(): void {
    this.opened = true;
    this.titleForm = 'Crear Perfil';
    this.profileDataUpdate = null;
  }

  /**
   * @description: Guarda la data del menu para aburirlo en el formulario
   */
  public actionSelectTable(data: any): void {
    this.opened = true;
    this.profileDataUpdate = { ...data };
    this.titleForm = 'Editar perfil';
  }


  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
    this.profileService.profileForm$.subscribe(({ formData, typeAction }) => {
      if (typeAction === 'add') {
        this.profileService.postProfile(formData).subscribe(() => {
          this.getProfiles();
          this._snackBar.open('Se ha creado el nuevo Perfil', 'CERRAR', { duration: 4000 });
        });
      } else if (typeAction === 'edit') {
        this.profileService.putProfile(formData).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
          this.getProfiles();
          this._snackBar.open('Perfil actualizado con exito', 'CERRAR', { duration: 4000 });
        });
      } else if (typeAction === 'delete') {
        const confirmation = this.confirmationService.open();
        confirmation.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
          if (result === 'confirmed') {
            this.profileService.deleteProfile(formData.id).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
              this._snackBar.open('Perfil Eliminado con exito', 'CERRAR', { duration: 4000 });
              this.getProfiles();
              this.opened = false;
            });
          }
        });
      }

    });
  }
}
