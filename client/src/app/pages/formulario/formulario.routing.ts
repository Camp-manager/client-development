import { Route } from '@angular/router';
import { FormularioComponent } from './formulario.component';

export const FormularioRoutes: Route[] = [
  {
    path: 'formulario/:tipo/:idAcampamento/:codigoRegistro',
    component: FormularioComponent,
    loadChildren: () =>
      import('./formulario.module').then((m) => m.FormularioModule),
  },
  {
    path: 'formulario',
    component: FormularioComponent,
  },
];
