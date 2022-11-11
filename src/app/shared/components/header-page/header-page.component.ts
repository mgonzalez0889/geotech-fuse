import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-header-page',
    templateUrl: './header-page.component.html',
    styleUrls: ['./header-page.component.scss'],
})
export class HeaderPageComponent implements OnInit {
    @Input() title: string = '';
    @Input() subTitle: string = '';

    constructor() {}

    ngOnInit(): void {}
}
