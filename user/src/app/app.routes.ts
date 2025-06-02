// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { acampamentosRoutes } from './pages/acampamentos/acampamentos.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'menu-principal',
    pathMatch: 'full',
  },
  {
    path: 'menu-principal',
    title: 'Menu Principal',
    data: { breadcrumb: 'Início' },
    loadComponent: () =>
      import('./pages/menu-principal/menu-principal.component').then(
        (m) => m.MenuPrincipalComponent
      ),
  },

  // Apenas espalha as rotas de acampamentos (que agora são aninhadas)
  ...acampamentosRoutes,

  // ... (outras rotas como 'equipe-trabalho') ...

  {
    path: '**',
    title: 'Página Não Encontrada',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
