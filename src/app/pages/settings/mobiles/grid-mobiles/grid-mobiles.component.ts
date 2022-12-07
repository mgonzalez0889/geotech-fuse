import { Component, OnDestroy, OnInit } from '@angular/core';
import { MobileService } from '@services/api/mobile.service';
import { IOptionTable } from 'app/core/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-grid-mobiles',
  templateUrl: './grid-mobiles.component.html',
  styleUrls: ['./grid-mobiles.component.scss'],
})
export class GridMobilesComponent implements OnInit, OnDestroy {
  public titlePage: string = 'Moviles';
  public subTitlepage: string = '';
  public dataFilter: string = '';
  public mobileSelect: any = null;
  public mobilesData: any[] = [];
  public opened: boolean = false;
  public optionsTable: IOptionTable[] = [
    {
      name: 'plate',
      text: 'Placa',
      typeField: 'text',
    },
    {
      name: 'internal_code',
      text: 'Codigo interno',
      typeField: 'text',
    },
    {
      name: 'name_driver',
      text: 'Conductor',
      typeField: 'text',
      defaultValue: 'Sin conductor',
    },
    {
      name: 'battery',
      text: 'Bateria',
      typeField: 'percentage',
    },
    {
      name: 'mobile_model',
      text: 'Modelo',
      typeField: 'text',
    },
    {
      name: 'name_type',
      text: 'Tipo de vehiculo',
      typeField: 'text',
    },
  ];
  public columnsMobiles: string[] = this.optionsTable.map(({ name }) => name);
  private unsubscribe$ = new Subject<void>();

  constructor(private ownerPlateService: MobileService) { }

  ngOnInit(): void {
    this.getMobiles();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public selectMobile(data: any): void {
    this.opened = true;
    this.mobileSelect = { ...data };
  }

  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: Trae todos los moviles del cliente
   */
  private getMobiles(): void {
    this.ownerPlateService.getMobiles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.subTitlepage = data
          ? `${data.length} moviles`
          : 'Sin moviles';
        this.mobilesData = [...data || []];
      });
  }
}
