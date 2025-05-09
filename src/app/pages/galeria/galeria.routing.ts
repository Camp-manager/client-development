import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GaleriaComponent } from './galeria.component';



const routes: Routes = [
  {
    path: '',
    component: GaleriaComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import('./components/detalhes/detalhes.module')
        .then(m => m.DetalhesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaleriaRoutingModule { }
