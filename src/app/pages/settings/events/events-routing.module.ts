import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GridEventsComponent} from "./grid-events/grid-events.component";

const routes: Routes = [
    {
        path: '',
        component: GridEventsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventsRoutingModule {
}
