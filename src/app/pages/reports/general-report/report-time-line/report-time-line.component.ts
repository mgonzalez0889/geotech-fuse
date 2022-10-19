import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoriesService } from 'app/core/services/histories.service';

@Component({
    selector: 'app-report-time-line',
    templateUrl: './report-time-line.component.html',
    styleUrls: ['./report-time-line.component.scss'],
})
export class ReportTimeLineComponent implements OnInit {
    constructor(
        private activatedRouter: ActivatedRoute,
        private _historicService: HistoriesService
    ) {}

    ngOnInit(): void {
        this.activatedRouter.queryParams.subscribe(
            ({ events, fleets, plates, limit, page, ...dataQuery }) => {
                const eventsArray = this.convertStringToArray(
                    events,
                    'events'
                ) as number[];

                const fleetsArray = this.convertStringToArray(
                    fleets,
                    'fleets'
                ) as number[];

                const platesArray = this.convertStringToArray(
                    plates,
                    'plates'
                ) as string[];

                this._historicService
                    .getHistories({
                        events: eventsArray,
                        plates: platesArray,
                        fleets: fleetsArray,
                        limit: Number(limit),
                        page: Number(page),
                        ...dataQuery,
                    })
                    .subscribe((payload) => {
                        console.log(payload);
                    });
            }
        );
    }

    private convertStringToArray(
        value: string,
        keyValid: string
    ): number[] | string[] {
        return keyValid === 'plates'
            ? value.split(',')
            : value.split(',').map((valueArray: string) => Number(valueArray));
    }
}
