import { Routes } from '@angular/router';

export const equipeTrabalhoRoutes: Routes = [
  {
    path: 'equipe-de-trabalho', // Base path for default loading
    title: 'Equipe de Trabalho',
    data: { breadcrumb: 'Equipe de Trabalho' }, // General breadcrumb
    loadComponent: () =>
      import('./equipe-de-trabalho.component').then(
        (m) => m.EquipeDeTrabalhoComponent
      ),
  },
  {
    path: 'equipe-de-trabalho/:acampamentoCode', // Specific camp
    title: 'Equipe de Trabalho do Acampamento',
    // Breadcrumb could be dynamically set in the component based on acampamento name/code
    data: { breadcrumb: 'Equipe do Acampamento' },
    loadComponent: () =>
      import('./equipe-de-trabalho.component').then(
        (m) => m.EquipeDeTrabalhoComponent
      ),
  },
];
