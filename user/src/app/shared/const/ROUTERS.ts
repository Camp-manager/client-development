import { RouterHelpers } from '../model/RouterHelper';

export const ROUTERS: RouterHelpers = [
  { nome: 'Menu Principal', path: '/menu-principal', icon: 'fa-home' },
  {
    nome: 'Acampamentos',
    path: '/acampamentos', // Main link for the acampamentos section
    icon: 'fa-campground',
    children: [
      { nome: 'Listar Todos', path: '/acampamentos/lista', icon: 'fa-list' },
      {
        nome: 'Novo Acampamento',
        path: '/acampamentos/formulario',
        icon: 'fa-plus',
      },
    ],
  },
  {
    nome: 'Equipe de Trabalho',
    path: '/equipe-de-trabalho',
    icon: 'fa-users-cog',
  },
  {
    nome: 'Campistas',
    path: '/campistas',
    icon: 'fa-users',
  },
  {
    nome: 'Cronogramas',
    path: '/cronogramas',
    icon: 'fa-solid fa-clipboard-list',
    children: [
      { nome: 'Novo Cronograma', path: '/cronogramas/novo', icon: 'fa-plus' },
      // { nome: 'Listar Cronogramas', path: '/cronogramas/lista', icon: 'fa-list' } // For when list component is ready
    ],
  },
];
