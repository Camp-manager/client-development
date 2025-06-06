import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AcampamentoFormularioComponent } from './components/formulario/formulario.component';
import { AcampamentoListarComponent } from './components/listar/listar.component';

@Component({
  selector: 'app-acampamentos',
  standalone: true,
  imports: [
    RouterModule,
    AcampamentoFormularioComponent,
    AcampamentoListarComponent,
  ],
  templateUrl: './acampamentos.component.html',
  styleUrl: './acampamentos.component.scss',
})
export class AcampamentosComponent {}
