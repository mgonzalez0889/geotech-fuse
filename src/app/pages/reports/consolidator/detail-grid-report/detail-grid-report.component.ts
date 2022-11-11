import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-detail-grid-report',
    templateUrl: './detail-grid-report.component.html',
    styleUrls: ['./detail-grid-report.component.scss'],
})
export class DetailGridReportComponent implements OnInit {
    @Input() detailData: any;
    @Output() emitClose = new EventEmitter<void>();
    constructor() {}

    ngOnInit(): void {}

    onClose(): void {
        this.emitClose.emit();
    }
}
