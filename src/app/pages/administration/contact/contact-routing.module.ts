import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridContactComponent } from './grid-contact/grid-contact.component';
const routes: Routes = [
    {
        path: '',
        component: GridContactComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactRoutingModule {
}
