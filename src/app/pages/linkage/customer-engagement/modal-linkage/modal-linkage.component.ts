import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators  } from '@angular/forms';
import { UsersService } from '@services/api/users.service';
import { LinkageService } from '../../../../core/services/api/linkage.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-modal-linkage',
  templateUrl: './modal-linkage.component.html',
  styleUrls: ['./modal-linkage.component.scss']
})
export class ModalLinkageComponent implements OnInit {

name: string ;
clientsApi: any[] ;
clientSelect: | undefined;


    formClient: FormGroup = this.fb.group({
      name : [ , [ Validators.required, Validators.minLength(3) ]],

    });


    constructor(
      private fb: FormBuilder,
      private linkageService: LinkageService
        ) { }




  ngOnInit(): void {

    this.lookingFor();
  }

  guardar(): void {

   return console.log(this.formClient.value);
  }

  public lookingFor(): void {

    this.name =this.formClient.controls['name'].value;

    this.linkageService.getUsersModal()
      .subscribe( data => this.clientsApi = data
        );


      console.log(this.clientsApi, this.name);
  }



  clientSelected( event: MatAutocompleteSelectedEvent ): any {

    if(!event.option.value) {
      this.clientSelect = undefined;
      return;
    }
  }










}
