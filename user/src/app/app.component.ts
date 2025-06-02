import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RouterNavigationComponent } from './components/router-navigation/router-navigation.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterHelpers } from './shared/model/RouterHelper';
import { ROUTERS } from './shared/const/ROUTERS';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    LoginComponent,
    RouterNavigationComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'CampManager';
  token: string | null = null;
  public navigationRoutes: RouterHelpers = ROUTERS; // Suas rotas para o menu

  // Novo estado para a sidebar
  isSidebarMinimized = false;

  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.checkToken();
  }

  checkToken(): void {
    this.token = localStorage.getItem('token');
  }

  setToken(): void {
    this.checkToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.checkToken();
    this.router.navigate(['/']);
  }

  // Novo método para alternar a sidebar
  toggleSidebar(): void {
    this.isSidebarMinimized = !this.isSidebarMinimized;
  }
}
