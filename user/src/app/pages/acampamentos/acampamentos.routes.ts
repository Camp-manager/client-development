import { Routes } from '@angular/router';

export const acampamentosRoutes: Routes = [
  {
    path: 'acampamentos',
    title: 'Acampamentos',
    data: { breadcrumb: 'Acampamentos' },
    loadComponent: () =>
      import('./acampamentos.component') // Crie este
        .then((m) => m.AcampamentosComponent),
  },
  {
    path: 'acampamentos/lista',
    title: 'Lista de Acampamentos',
    data: { breadcrumb: 'Lista' },
    loadComponent: () =>
      import('./components/listar/listar.component') // Crie este
        .then((m) => m.AcampmanetoListarComponent),
  },
  {
    path: 'acampamentos/formulario', // Para 'Novo'
    title: 'Novo Acampamento',
    data: { breadcrumb: 'Formulário' },
    loadComponent: () =>
      import('./components/formulario/formulario.component') // Crie este
        .then((m) => m.AcampamentoFormularioComponent),
  },
  {
    path: 'formulario/:id', // Para 'Editar'
    title: 'Editar Acampamento',
    data: { breadcrumb: 'Editar' }, // O breadcrumb pode ser dinâmico no componente
    loadComponent: () =>
      import('./components/formulario/formulario.component') // Reusa o form
        .then((m) => m.AcampamentoFormularioComponent),
  },
];
