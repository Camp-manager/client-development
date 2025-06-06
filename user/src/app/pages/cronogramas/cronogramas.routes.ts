import { Routes } from '@angular/router';

export const cronogramasRoutes: Routes = [
  {
    path: 'cronogramas/novo',
    title: 'Novo Cronograma',
    data: { breadcrumb: 'Novo Cronograma' },
    loadComponent: () =>
      import('./components/formulario/formulario.component').then(
        (m) => m.FormularioCronogramaComponent
      ),
  },
  {
    path: 'cronogramas',
    redirectTo: 'cronogramas/novo',
    pathMatch: 'full',
  },
];
