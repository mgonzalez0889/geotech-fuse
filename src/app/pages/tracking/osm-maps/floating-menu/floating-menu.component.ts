import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MobileService } from '../../../../core/services/mobile.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '../../../../../@fuse/animations';
import { HelperService } from '../../../../core/services/helper.service';
import { MobilesInterface } from '../../../../core/interfaces/mobiles.interface';
import { HistoriesService } from '../../../../core/services/histories.service';
import { MatDialog } from "@angular/material/dialog";
import {
    FormDialogSelectHistorialComponent
} from "../form-dialog-select-historial/form-dialog-select-historial.component";
import { IconService } from 'app/core/services/icons/icon.service';
import { MobilesService } from 'app/core/services/mobiles/mobiles.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';

@Component({
    selector: 'app-floating-menu',
    templateUrl: './floating-menu.component.html',
    styleUrls: ['./floating-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FloatingMenuComponent implements OnInit, OnDestroy {
    @Output() sendMarker: EventEmitter<any> = new EventEmitter<any>();
    public displayedColumns: string[] = ['select', 'code', 'menu'];
    public dataSource: any = [];
    public items: MobilesInterface[] = [];
    public selection = new SelectionModel<MobilesInterface>(true, []);
    public subscription: Subscription;
    public showMenu: boolean = true;
    public showReport: boolean = true;
    public animationStates: any;
    public visibilityStates: any;
    public showMenuGroup: boolean = false;
    constructor(
        private mobilesService: MobileService,
        public mobileRequestService: MobilesService,
        private historiesService: HistoriesService,
        public dialog: MatDialog,
        public mapFunctionalitieService: MapFunctionalitieService,
        private iconService: IconService
    ) {
        this.animationStates = {
            expandCollapse: 'expanded',
            fadeIn: {
                direction: 'in',
                in: '*',
                top: '*',
                bottom: '*',
                left: '*',
                right: '*'
            },
            fadeOut: {
                direction: 'out',
                out: '*',
                top: '*',
                bottom: '*',
                left: '*',
                right: '*'
            },
            shake: {
                shake: true
            },
            slideIn: {
                direction: 'top',
                top: '*',
                bottom: '*',
                left: '*',
                right: '*'
            },
            slideOut: {
                direction: 'top',
                top: '*',
                bottom: '*',
                left: '*',
                right: '*'
            },
            zoomIn: {
                in: '*'
            },
            zoomOut: {
                out: '*'
            }
        };

        this.visibilityStates = {
            expandCollapse: true,
            fadeIn: {
                in: true,
                top: true,
                bottom: true,
                left: true,
                right: true
            },
            fadeOut: {
                out: true,
                top: true,
                bottom: true,
                left: true,
                right: true
            },
            shake: {
                shake: true
            },
            slideIn: {
                top: true,
                bottom: true,
                left: true,
                right: true
            },
            slideOut: {
                top: true,
                bottom: true,
                left: true,
                right: true
            },
            zoomIn: {
                in: true
            },
            zoomOut: {
                out: true
            }
        };
    }

    ngOnInit(): void {
        this.iconService.loadIcons();
        this.getMobiles();
        this.listenObservableShow();
    }

    /**
     * @description: Cierra la ventana de opciones
     */
    public onShowMenu(): void {
        this.showMenu = !this.showMenu;
    }

    /**
     * @description: Submenu de opciones
     */
    public onShowMenuGroup(): void {
        this.showMenuGroup = !this.showMenuGroup;
    }

    /**
     * @description: Opcion agrupar, mostrar flotas
     */
    public onShowMenuFleet(): void {
        this.historiesService.floatingMenuFleet$.next({ show: true });
    }

    public onFormModal(): void {
        const dialogRef = this.dialog.open(FormDialogSelectHistorialComponent, {
            minWidth: '25%',
            minHeight: '60%',
        });
        dialogRef.afterClosed().toPromise();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle(): void {
        // console.log(this.selection);
        this.isAllSelected() ? this.selection.clear() :
            this.dataSource.data.forEach((row) => {
                this.selection.select(row);
            });

        if (this.selection.selected.length) {
            this.items.map((x) => {
                x['selected'] = true;
                return x;
            });
        } else {
            this.items.map((x) => {
                x['selected'] = false;
                return x;
            });
        }
        this.sendMarker.emit(this.items);
    }

    /**
     * @description: Selecciona un mobile individual
     */
    public individual(event, value: MobilesInterface): void {
        this.mapFunctionalitieService.mobiles.map((x) => {
            if (x.id == value.id) {
                x.selected = !event;
            }
            return x;
        });
        let marker = this.mapFunctionalitieService.mobiles.filter(function (x) {
            return x.selected == true;
        });
        this.mapFunctionalitieService.receiveData('checked', marker)

    }

    /**
     * @description: Carga los mobiles desde el inicio
     */
    async getMobiles() {
        await this.mobileRequestService.getMobiles();
    }

    /**
     * @description: Escucha los observables
     */
    private listenObservableShow(): void {
        this.subscription = this.historiesService.modalShowSelected$.subscribe(({ show }) => {
            if (!show) {
                this.showReport = show;
            } else {
                this.showReport = show;
            }
        });
    }

    /**
     * @description: Filtra registros de la grid
    */
    public applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.mapFunctionalitieService.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * @description: Elimina las subcripciones
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async goDetail(id) {
        await this.mobileRequestService.getDetailMobile(id);
        this.mapFunctionalitieService.showDetailMobile = true
    }
}
