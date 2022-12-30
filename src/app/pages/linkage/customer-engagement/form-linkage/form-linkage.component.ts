import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';
import { fuseAnimations } from '@fuse/animations';
import { LinkageService } from '@services/api/linkage.service';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-form-linkage',
  templateUrl: './form-linkage.component.html',
  styleUrls: ['./form-linkage.component.scss'],
  animations: fuseAnimations
})
export class FormLinkageComponent implements OnInit {
  @Input() dataUpdate: any = null;
  @Input() titleForm: string = '';
  @Output() emitCloseForm = new EventEmitter<void>();
  public opened: boolean = false;
  public userDataUpdate: any = null;
  public userData: any[] = [];
  public formUserClient: FormGroup = this.fb.group({});
  public formSearchClient: FormGroup = this.fb.group({});
  public editMode: boolean = false;
  public dataSearchClient: [] = [];
  public valueSearch: string = '';
  public clientSelected: [] = [];


  constructor(
    private toastAlert: ToastAlertService,
    private fb: FormBuilder,
    private linkageService: LinkageService
  ) {
    this.buildForm();
    this.buildFormSearchClient();
  }

  ngOnInit(): void {}

  public closeForm(): void {
    this.emitCloseForm.emit();
    this.editMode = false;
    this.userDataUpdate = null;
    this.formUserClient.reset();
    this.formSearchClient.reset();
  }

  public search(): void {
    this.dataSearchClient = [];
    this.valueSearch = this.formSearchClient.controls['search'].value;

    if (this.formSearchClient.valid) {
      this.linkageService.getSearchClient(this.valueSearch).subscribe(({ data }) => {
        this.dataSearchClient = data;
      });
    }
  }

  public onSave(): void {
    const data = this.formUserClient.getRawValue();
    this.formUserClient.disable();
    this.linkageService.postClient(data).subscribe((res) => {
      this.formUserClient.enable();
      this.emitCloseForm.emit();
      if (res.code === 200) {
        this.toastAlert.toasAlertSuccess({
          message: 'Cliente creado con exito'
        });
      } else {
        this.toastAlert.toasAlertWarn({
          message: 'Error cliente ya existe'
        });
      }
    });
  }

  selectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      return;
    }
    const clientSelect = event.option.value;
    this.editMode = true;
    this.clientSelected = this.dataSearchClient.find(client => client['name'] === clientSelect);
    this.formUserClient.reset();
    // this.formUserClient.patchValue({...this.clientSelected});
    this.formUserClient.controls['nit'].setValue(this.clientSelected['nit']);
    this.formUserClient.controls['name'].setValue(this.clientSelected['name']);
    this.formUserClient.controls['phone'].setValue(this.clientSelected['phone']);
    this.formUserClient.controls['email'].setValue(this.clientSelected['email']);
    this.formSearchClient.controls['search'].setValue('');
    this.dataSearchClient = [];
    this.valueSearch = '';
  }

  /**
   * @description: Definicion del formulario reactivo
   */
  private buildForm(): void {
    this.formUserClient = this.fb.group({
      nit: ['',],
      name: ['',],
      phone: ['',],
      email: ['',],
      date_issued: ['', [Validators.required,]]

    });
  }

  private buildFormSearchClient(): void {
    this.formSearchClient = this.fb.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

}


