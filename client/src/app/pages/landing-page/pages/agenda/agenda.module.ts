import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AgendaRoutingModule } from './agenda.routing';
import { AgendaComponent } from './agenda.component';

@NgModule({
  declarations: [AgendaComponent],
  imports: [CommonModule, DatePipe, AgendaRoutingModule],
})
export class AgendaModule {}
