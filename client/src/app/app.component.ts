import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importe o Router, NavigationEnd e o operador filter
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private router = inject(Router);

  isFormularioRoute = false;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isFormularioRoute =
          event.urlAfterRedirects.includes('/formulario');
      });
  }
}
