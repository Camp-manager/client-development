import { Routes } from '@angular/router';

export const campistasRoutes: Routes = [
  {
    path: 'campistas',
    title: 'Lista de Campistas',
    data: { breadcrumb: 'Campistas' },
    loadComponent: () =>
      import('./components/listar/listar.component').then(
        (m) => m.CampistasListarComponent
      ),
  },
  {
    path: 'campistas/:acampamentoCode',
    title: 'Campistas do Acampamento',
    data: { breadcrumb: 'Campistas do Acampamento' },
    loadComponent: () =>
      import('./components/listar/listar.component').then(
        (m) => m.CampistasListarComponent
      ),
  },
];
