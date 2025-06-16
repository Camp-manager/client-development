import { Routes } from '@angular/router';

export const editorRoutes: Routes = [
  {
    path: 'editar/:idAcampamento',
    title: 'Canva',
    data: { breadcrumb: 'Canva' },
    loadComponent: () =>
      import('./editor-de-imagens.component').then(
        (m) => m.EditorDeImagensComponent
      ),
  },
  {
    path: 'editar',
    title: 'Canva',
    data: { breadcrumb: 'Canva' },
    loadComponent: () =>
      import('./editor-de-imagens.component').then(
        (m) => m.EditorDeImagensComponent
      ),
  },
];
