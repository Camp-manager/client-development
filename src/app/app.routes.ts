import { Routes } from '@angular/router';

export const routes: Routes = [
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
  }
];
