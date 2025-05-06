import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NossaHistoriaComponent } from './nossa-historia.component';



const routes: Routes = [
  {
    path: '',
    component: NossaHistoriaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NossaHistoriaRoutingModule { }
