import { Routes } from '@angular/router';

export const estoqueRoutes: Routes = [
  {
    path: 'estoques',
    title: 'Estoques',
    data: { breadcrumb: 'Estoques' },
    loadComponent: () =>
      import('./estoques.component').then((m) => m.EstoquesComponent),
  },
];
