import { Routes } from '@angular/router';

export const acampamentosRoutes: Routes = [
  {
    path: 'acampamentos',
    title: 'Acampamentos',
    data: { breadcrumb: 'Acampamentos' },
    loadComponent: () =>
      import('./acampamentos.component').then((m) => m.AcampamentosComponent),
  },
  {
    path: 'acampamentos/lista',
    title: 'Lista de Acampamentos',
    data: { breadcrumb: 'Lista' },
    loadComponent: () =>
      import('./components/listar/listar.component').then(
        (m) => m.AcampamentoListarComponent
      ),
  },
  {
    path: 'acampamentos/formulario',
    title: 'Novo Acampamento',
    data: { breadcrumb: 'Formulário' },
    loadComponent: () =>
      import('./components/formulario/formulario.component').then(
        (m) => m.AcampamentoFormularioComponent
      ),
  },
];
