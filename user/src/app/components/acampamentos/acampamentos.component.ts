import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioComponent } from './components/formulario/formulario.component';
import { ListarComponent } from './components/listar/listar.component';

@Component({
  selector: 'app-acampamentos',
  standalone: true, // Adicionado
  imports: [RouterModule, FormularioComponent, ListarComponent], // Adicionado
  templateUrl: './acampamentos.component.html',
  styleUrl: './acampamentos.component.scss',
})
export class AcampamentosComponent {
  // Atua como menu/dashboard
}
