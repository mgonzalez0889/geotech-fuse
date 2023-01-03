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
  public showError: boolean = false;
  public sendEmail: boolean=false;


  constructor(
    private toastAlert: ToastAlertService,
    private fb: FormBuilder,
    private linkageService: LinkageService
  ) {
    this.buildForm();
    this.buildFormSearchClient();
  }

  ngOnInit(): void { }

  public closeForm(): void {
    this.emitCloseForm.emit();
    this.editMode = false;
    this.userDataUpdate = null;
    this.formUserClient.reset();
    this.formSearchClient.reset();
    this.sendEmail=false;
  }

  public openEdit(): void{
    this.editMode=true;
    console.log(this.userDataUpdate);
    this.formUserClient.patchValue({...this.dataUpdate});
    this.sendEmail=true;
    this.formUserClient.controls['email'].setValidators(Validators.required);
    this.formUserClient.controls['email'].updateValueAndValidity();
  }

  public sendEmailServices(): void{

  }

  public search(): void {
    this.valueSearch = this.formSearchClient.controls['search'].value.toUpperCase();
    if (this.formSearchClient.valid) {
      this.linkageService.getSearchClient(this.valueSearch).subscribe(({ data }) => {
        this.dataSearchClient = data ? data : [];
        this.showError = data ? false : true;
      });
    } else {
      this.dataSearchClient = [];
    }
  }

  public onSave(): void {
    const data = this.formUserClient.getRawValue();
    console.log(data);
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
        ;
      }
    });
  }

  selectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      return;
    }
    this.editMode = true;
    this.clientSelected = event.option.value;
    this.formUserClient.reset();
    this.formUserClient.controls['legal_representative'].clearValidators();
    this.formUserClient.controls['document_number'].clearValidators();

    if (this.clientSelected['company']==='NIT'){
      this.formUserClient.controls['legal_representative'].setValidators(Validators.required);
      this.formUserClient.controls['document_number'].setValidators(Validators.required);
    }else{
      this.formUserClient.controls['legal_representative'].clearValidators();
      this.formUserClient.controls['document_number'].clearValidators();
    }

    this.formUserClient.controls['legal_representative'].updateValueAndValidity();
    this.formUserClient.controls['document_number'].updateValueAndValidity();

    this.formUserClient.patchValue({...this.clientSelected});
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
      email: ['',[Validators.email]],
      legal_representative: ['',],
      document_number: ['',],
      date_issued: ['', [Validators.required]],
      company:['',]
    });
  }

  private buildFormSearchClient(): void {
    this.formSearchClient = this.fb.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }





}


