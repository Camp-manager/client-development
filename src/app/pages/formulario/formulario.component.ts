import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {

  pagina: number = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const code = this.router.getCurrentNavigation()?.extras.state?.['code'];
  }

  goBack() {
    this.pagina = this.pagina - 1;
    if (this.pagina < 1) {
      this.router.navigate(['/']);
    }
  }

}
