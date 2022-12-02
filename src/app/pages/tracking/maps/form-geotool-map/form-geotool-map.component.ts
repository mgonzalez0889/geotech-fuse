import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeotoolMapService } from 'app/core/services/api/geotool-map.service';
import { MobileService } from 'app/core/services/mobile.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MapToolsService } from '../../../../core/services/maps/map-tools.service';
import { ToastAlertService } from '../../../../core/services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-form-geotool-map',
  templateUrl: './form-geotool-map.component.html',
  styleUrls: ['./form-geotool-map.component.scss']
})
export class FormGeotoolMapComponent implements OnInit, OnDestroy {
  @Input() titleForm: string = '';
  @Input() typeGeo: string = '';
  @Output() closeForm = new EventEmitter<{ closePanel: boolean; refreshData: boolean }>();
  public formGeotool: FormGroup = this.fb.group({});
  public colors = ['#6B7280', '#FBBF24', '#F43F5E', '#145D2D', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private mobilesService: MobileService,
    private mapService: MapToolsService,
    private geoMapService: GeotoolMapService,
    private toasAlert: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.mapService.shapeData$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((shape) => {
        this.formGeotool.get('shape').patchValue([...shape]);
      });
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
    this.mapService.deleteEventMap('zoom');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSubmit(): void {
    const geoData = this.formGeotool.value;

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
        }
      });
  }

  private buildForm(): void {
    this.formGeotool = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      color: ['#6B7280', Validators.required],
      shape: ['', [Validators.required]],
      diameter: [12],
    });
  }
}

