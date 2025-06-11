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
    path: 'cronogramas/buscar-todos/:idAcampamento',
    title: 'Todos Cronogramas',
    data: { breadcrumb: 'Todos Cronogramas' },
    loadComponent: () =>
      import('./components/listar/listar.component').then(
        (m) => m.ListarCronogramasComponent
      ),
  },
  {
    path: 'cronogramas',
    redirectTo: 'cronogramas/novo',
    pathMatch: 'full',
  },
];
