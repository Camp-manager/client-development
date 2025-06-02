import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'nossa-historia',
      },
      {
        path: 'nossa-historia',
        loadChildren: () =>
          import('./pages/nossa-historia/nossa-historia.module').then(
            (m) => m.NossaHistoriaModule
          ),
      },
      {
        path: 'galeria',
        loadChildren: () =>
          import('./pages/galeria/galeria.module').then((m) => m.GaleriaModule),
      },
      {
        path: 'agenda',
        loadChildren: () =>
          import('./pages/agenda/agenda.module').then((m) => m.AgendaModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
