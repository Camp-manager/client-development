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
  // {
  //     path: 'lista',
  //     title: 'Lista de Acampamentos',
  //     data: { breadcrumb: 'Lista' },
  //     loadComponent: () => import('./components/acampamentos/components/lista/lista.component') // Crie este
  //         .then(m => m.AcampamentoListaComponent),
  // },
  {
    path: 'acampamentos/formulario', // Para 'Novo'
    title: 'Novo Acampamento',
    data: { breadcrumb: 'Formulário' },
    loadComponent: () =>
      import('./components/formulario/formulario.component') // Crie este
        .then((m) => m.FormularioComponent),
  },
  {
    path: 'formulario/:id', // Para 'Editar'
    title: 'Editar Acampamento',
    data: { breadcrumb: 'Editar' }, // O breadcrumb pode ser dinâmico no componente
    loadComponent: () =>
      import('./components/formulario/formulario.component') // Reusa o form
        .then((m) => m.FormularioComponent),
  },
];
