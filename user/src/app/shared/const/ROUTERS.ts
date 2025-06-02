import { RouterHelpers } from "../model/RouterHelper";

export const ROUTERS: RouterHelpers = [
  { nome: 'Menu Principal', path: '/menu-principal', icon: 'fa-home' },
  {
    nome: 'Acampamentos', path: '/acampamentos', icon: 'fa-campground', children: [
      { nome: 'Listar', path: '/acampamentos/lista', icon: 'fa-list' },
      { nome: 'Novo', path: '/acampamentos/formulario', icon: 'fa-plus' },
    ]
  },
  { nome: 'Equipe de Trabalho', path: '/equipe-trabalho', icon: 'fa-users' }
];
