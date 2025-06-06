import { Routes } from '@angular/router';

export const campistasRoutes: Routes = [
  {
    path: 'campistas',
    title: 'Lista de Campistas',
    data: { breadcrumb: 'Campistas' },
    loadComponent: () =>
      import('./components/listar/listar.component').then(
        (m) => m.ListarCampistasComponent
      ),
  },
  {
    path: 'campistas/:acampamentoCode',
    title: 'Campistas do Acampamento',
    // Breadcrumb can be made dynamic in the component if needed
    data: { breadcrumb: 'Campistas do Acampamento' },
    loadComponent: () =>
      import('./components/listar/listar.component').then(
        (m) => m.ListarCampistasComponent
      ),
  },
];
