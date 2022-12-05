import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeGeotool } from 'app/core/interfaces';
import { GeotoolMapService } from 'app/core/services/api/geotool-map.service';
import { MobileService } from 'app/core/services/api/mobile.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MapToolsService } from '../../../../core/services/maps/map-tools.service';
import { ToastAlertService } from '../../../../core/services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-form-geotool-map',
  templateUrl: './form-geotool-map.component.html',
  styleUrls: ['./form-geotool-map.component.scss']
})
export class FormGeotoolMapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() titleForm: string = '';
  @Input() typeGeo: TypeGeotool = 'none';
  @Input() dataUpdate: any = null;
  @Output() closeForm = new EventEmitter<{ closePanel: boolean; refreshData: boolean }>();
  public formGeotool: FormGroup = this.fb.group({});
  public colors = ['#6B7280', '#FBBF24', '#F43F5E', '#145D2D', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#1A6FB5'];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private mobilesService: MobileService,
    private mapService: MapToolsService,
    private geoMapService: GeotoolMapService,
    private toasAlert: ToastAlertService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.mapService.shapeData$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((shape) => {
        this.formGeotool.get('shape').patchValue([...shape]);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataUpdate) {
      this.formGeotool.patchValue({ ...this.dataUpdate });
    }
  }

  ngOnDestroy(): void {
    this.mobilesService.mobiles$
      .pipe(
        filter(data => !!data.length),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.mapService.clearMap();
        this.mapService.setMarkers(data, true);
      });
    this.mapService.deleteEventMap();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSubmit(): void {
    const geoData = this.formGeotool.value;
    const shapeData = this.formGeotool.get('shape').value;

    if (!shapeData.length) {
      this.toasAlert.toasAlertWarn({
        message: '¡Debes crear un punto, ruta o zona en el mapa!'
      });
      return;
    }

    if (this.dataUpdate) {
      this.updateGeo(geoData);
    } else {
      this.createGeo(geoData);
    }

    setTimeout(() => {
      this.formGeotool.reset();
    }, 1000);
  }

  private createGeo(geoData: any): void {
    this.geoMapService.postGeometry(this.typeGeo, geoData)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        if (data.code === 200) {
          this.closeForm.emit({ closePanel: false, refreshData: true });
          this.toasAlert.toasAlertSuccess({
            message: '¡Geometria creada con exito!'
          });
        } else {
          this.toasAlert.toasAlertWarn({
            message: '¡Lo sentimos algo ha salido mal, vuelva a intentarlo!'
          });
          this.closeForm.emit({ closePanel: false, refreshData: false });
        }
      });
  }

  private updateGeo(geoData: any): void {
    this.geoMapService.updateGeometry(this.typeGeo, geoData, this.dataUpdate.id)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((result) => {
        if (result.code === 200) {
          this.closeForm.emit({ closePanel: false, refreshData: true });
          this.toasAlert.toasAlertSuccess({
            message: '¡Geometria modificada con exito!'
          });
        } else {
          this.toasAlert.toasAlertWarn({
            message: '¡Lo sentimos algo ha salido mal, vuelva a intentarlo!'
          });
          this.closeForm.emit({ closePanel: false, refreshData: false });
        }
      });
  }


  private buildForm(): void {
    this.formGeotool = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      color: ['#6B7280', Validators.required],
      shape: [[]],
      diameter: [12],
    });
  }
}

