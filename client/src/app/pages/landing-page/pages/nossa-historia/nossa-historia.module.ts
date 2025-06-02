import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NossaHistoriaComponent } from './nossa-historia.component';
import { NossaHistoriaRoutingModule } from './nossa-historia.routing';



@NgModule({
  declarations: [NossaHistoriaComponent],
  imports: [
    CommonModule,
    NossaHistoriaRoutingModule
  ]
})
export class NossaHistoriaModule { }
