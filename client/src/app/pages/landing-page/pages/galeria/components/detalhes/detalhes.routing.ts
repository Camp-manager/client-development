import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalhesComponent } from './detalhes.component';



const routes: Routes = [
  {
    path: '',
    component: DetalhesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalhesRoutingModule { }
