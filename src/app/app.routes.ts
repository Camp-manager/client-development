import { Routes } from '@angular/router';

export const routes: Routes = [
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
  }
];
