import { Routes } from '@angular/router';

export const equipeTrabalhoRoutes: Routes = [
  {
    path: 'equipe', // Base path for default loading
    title: 'Equipe',
    data: { breadcrumb: 'Equipes de Trabalho' }, // General breadcrumb
    loadComponent: () =>
      import('./equipe.component').then((m) => m.EquipeComponent),
  },
  {
    path: 'equipe/:idAcampamento', // Specific camp
    title: 'Equipes do Acampamento',
    // Breadcrumb could be dynamically set in the component based on acampamento name/code
    data: { breadcrumb: 'Equipes do Acampamento' },
    loadComponent: () =>
      import('./equipe.component').then((m) => m.EquipeComponent),
  },
];
