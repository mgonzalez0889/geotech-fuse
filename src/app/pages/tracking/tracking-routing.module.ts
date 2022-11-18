import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'maps2',
        loadChildren: () => import('./osm-maps/osm-maps.module').then(m => m.OsmMapsModule)
      }, {
        path: 'maps',
        loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
      }, {
        path: 'commands',
        loadChildren: () => import('./commands/commands.module').then(m => m.CommandsModule)
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingRoutingModule { }
