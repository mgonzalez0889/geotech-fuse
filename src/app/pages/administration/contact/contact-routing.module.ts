import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GridContactComponent} from './grid-contact/grid-contact.component';
import {FormContactComponent} from "./form-contact/form-contact.component";

const routes: Routes = [
    {
        path: '',
        component: GridContactComponent
    },
    {
        path: 'formcontact',
        component: FormContactComponent
    },
    {
        path: 'editContact/:id',
        component: FormContactComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactRoutingModule {
}
