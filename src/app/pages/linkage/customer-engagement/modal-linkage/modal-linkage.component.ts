import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LinkageService } from '../../../../core/services/api/linkage.service';

@Component({
  selector: 'app-modal-linkage',
  templateUrl: './modal-linkage.component.html',
  styleUrls: ['./modal-linkage.component.scss']
})
export class ModalLinkageComponent implements OnInit {
  name: string;
  clientsApi: any[] = [];
  clientSelect: null | undefined;
  formClient: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private linkageService: LinkageService
  ) {
    this.formClient = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.linkageService.getUsersModal()
      .subscribe(({ data }) => {
        this.clientsApi = data;
      });
  }

  saveForm(): void {
    console.log(this.formClient.value);
  }

  public filterUser(e: any): void {
    console.log(e);
  }
}
