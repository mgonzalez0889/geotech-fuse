import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'maps',
                loadChildren: () => import('./osm-maps/osm-maps.module').then(m => m.OsmMapsModule)
            },  {
                path: 'maps2',
                loadChildren: () => import('./maps/maps-routing.module').then(m => m.MapsRoutingModule)
            }
        ]

    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingRoutingModule { }
