import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Para o link de 'voltar'

@Component({
  selector: 'app-not-found',
  standalone: true, // Adicionado
  imports: [RouterModule], // Adicionado para routerLink
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss' // Adicionado SCSS
})
export class NotFoundComponent { }
