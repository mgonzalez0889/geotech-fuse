import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MobileService } from '../../../../core/services/mobile.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '../../../../../@fuse/animations';
import { HelperService } from '../../../../core/services/helper.service';
import { MobilesInterface } from '../../../../core/interfaces/mobiles.interface';
import {
    FormDialogSelectHistorialComponent
} from "../form-dialog-select-historial/form-dialog-select-historial.component";
import { IconService } from 'app/core/services/icons/icon.service';
import { MobilesService } from 'app/core/services/mobiles/mobiles.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MapRequestService } from 'app/core/services/request/map-request.service';
import { HistoriesService } from 'app/core/services/histories.service';
import moment from 'moment';
import { FleetsService } from 'app/core/services/fleets.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormReportComponent } from '../form-report/form-report.component';

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
    public displayedColumnsFleets: string[] = ['select'];
    public dataSource: any = [];
    public items: MobilesInterface[] = [];
    public selection = new SelectionModel<MobilesInterface>(true, []);
    public subscription: Subscription;
    public showMenu: boolean = true;
    public showReport: boolean = true;
    public animationStates: any;
    public visibilityStates: any;
    public showMenuGroup: boolean = false;
    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDate();
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);

    constructor(
        public mobileRequestService: MobilesService,
        private historiesService: HistoriesService,
        public dialog: MatDialog,
        public mapFunctionalitieService: MapFunctionalitieService,
        private iconService: IconService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private fleetServices: FleetsService,
        public mapRequestService: MapRequestService
    ) {
        this.iconRegistry.addSvgIcon('signal-movil', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/signal-movil.svg'));
        this.iconRegistry.addSvgIcon('not-signal-movil', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/not-signal-movil.svg'));
        this.iconRegistry.addSvgIcon('fixed-movil', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/fixed-movil.svg'));
        this.iconRegistry.addSvgIcon('historic', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/historic.svg'));

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

        if (value.selected) {
            this.mapFunctionalitieService.plateHistoric.push(
                value.plate
            );
        } else {
            const indx = this.mapFunctionalitieService.plateHistoric.findIndex(v => v === value.plate);
            this.mapFunctionalitieService.plateHistoric.splice(indx, indx >= 0 ? 1 : 0);
        }
    }

    individualFleet(event, row) {
        this.mapFunctionalitieService.fleets.map((x) => {
            if (x.id == row.id) {
                x.selected = !event;
            }
            return x;
        });

        if (!row.selected) {
            let data = this.mapFunctionalitieService.platesFleet.filter(x => {
                return x.fleetId = row.id;
            });
            this.mapFunctionalitieService.deleteChecks(data[0].data);

            const indx = this.mapFunctionalitieService.platesFleet.findIndex(v => v.fleetId === row.id);
            this.mapFunctionalitieService.platesFleet.splice(indx, indx >= 0 ? 1 : 0);
        } else {
            this.subscription = this.fleetServices.getFleetsPlateAssignedMap(row.id).subscribe(({ data }) => {
                if (data.length > 0) {
                    this.mapFunctionalitieService.platesFleet.push({
                        fleetId: row.id,
                        data: data
                    });
                    this.mapFunctionalitieService.deleteChecks(this.mapFunctionalitieService.mobiles);
                    this.mapFunctionalitieService.setMarkers(data);
                }
            });
        }
    }

    /**
     * @description: Carga los mobiles desde el inicio
     */

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
     * @description: Filtra registros de la grid
    */
    public applyFilterFleets(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.mapFunctionalitieService.dataSourceFleets.filter = filterValue.trim().toLowerCase();
    }

    /**
     * @description: Elimina las subcripciones
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async generateHistoric() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.dialog.open(FormReportComponent, dialogConfig);
    }


}
