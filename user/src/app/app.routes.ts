import { Routes } from '@angular/router';
import { acampamentosRoutes } from './pages/acampamentos/acampamentos.routes';
import { equipeTrabalhoRoutes } from './pages/equipe-de-trabalho/equipe.routes';
import { cronogramasRoutes } from './pages/cronogramas/cronogramas.routes';
import { editorRoutes } from './pages/editor-de-imagens/editor-de-imagens.routes';
import { estoqueRoutes } from './pages/estoques/estoques.routes';

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

  ...acampamentosRoutes,
  ...equipeTrabalhoRoutes,
  ...cronogramasRoutes,
  ...editorRoutes,
  ...estoqueRoutes,

  {
    path: '**',
    title: 'Página Não Encontrada',
    data: { breadcrumb: 'Não Encontrado' }, // Optional: breadcrumb for not found
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
