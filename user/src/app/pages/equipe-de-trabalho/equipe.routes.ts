import { Routes } from '@angular/router';

export const equipeTrabalhoRoutes: Routes = [
  {
    path: 'equipe',
    title: 'Equipe',
    data: { breadcrumb: 'Equipes de Trabalho' },
    loadComponent: () =>
      import('./equipe.component').then((m) => m.EquipeComponent),
  },
  {
    path: 'equipe/:idAcampamento',
    title: 'Equipes do Acampamento',
    data: { breadcrumb: 'Equipes do Acampamento' },
    loadComponent: () =>
      import('./equipe.component').then((m) => m.EquipeComponent),
  },
];
