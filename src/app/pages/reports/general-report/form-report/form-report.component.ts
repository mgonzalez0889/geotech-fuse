import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-form-report',
    templateUrl: './form-report.component.html',
    styleUrls: ['./form-report.component.scss']
})
export class FormReportComponent implements OnInit {
    public form: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            plate: [''],
            date: this.fb.group({
                date_init: '',
                date_end: ''
            })
        });
    }


    ngOnInit(): void {
    }

}
