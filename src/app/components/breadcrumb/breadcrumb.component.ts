import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { ROUTERS } from '../../shared/const/ROUTERS';
import { RouterHelpers } from '../../shared/model/RouterHelper';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  private router = inject(Router);
  private allAppRoutes = ROUTERS;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        startWith(null)
      )
      .subscribe((event: NavigationEnd | null) => {
        const currentUrl = event ? event.urlAfterRedirects : this.router.url;
        this.breadcrumbs = this.buildManualBreadcrumbs(
          currentUrl,
          this.allAppRoutes
        );
      });
  }

  private buildManualBreadcrumbs(
    url: string,
    routes: RouterHelpers
  ): Breadcrumb[] {
    let bestMatch: Breadcrumb[] = [];
    const cleanUrl = url.split('?')[0];

    // Função recursiva para procurar na árvore
    // *** CORRIGIDO: Agora com 3 parâmetros ***
    const search = (
      currentRoutes: RouterHelpers,
      path_to_match: string, // <-- Parâmetro adicionado de volta
      currentTrail: Breadcrumb[]
    ): void => {
      for (const route of currentRoutes) {
        const routePrefix = route.path.replace(/:\w+/g, '[^/]+');
        const prefixRegex = new RegExp('^' + routePrefix);

        if (prefixRegex.test(path_to_match)) {
          let linkUrl = route.path;
          const exactMatchRegex = new RegExp(
            '^' + route.path.replace(/:\w+/g, '[^/]+') + '$'
          );
          if (route.path.includes(':') && exactMatchRegex.test(path_to_match)) {
            linkUrl = path_to_match; // Usa a URL atual se for match exato com params
          } else {
            linkUrl = route.path.split('/:')[0];
          }

          const newBreadcrumb = { label: route.nome, url: linkUrl };
          const newTrail = [...currentTrail, newBreadcrumb];

          // Se for match exato E mais longo (ou igual), é o melhor.
          if (exactMatchRegex.test(path_to_match)) {
            if (newTrail.length >= bestMatch.length) {
              bestMatch = newTrail;
            }
          }
          // Se for só prefixo E mais longo, guarda como candidato,
          // mas só se não houver um match exato melhor.
          else if (
            newTrail.length > bestMatch.length &&
            !new RegExp(
              '^' +
                bestMatch
                  .map((b) => b.url)
                  .join('')
                  .replace(/:\w+/g, '[^/]+') +
                '$'
            ).test(path_to_match)
          ) {
            bestMatch = newTrail;
          }

          if (route.children) {
            // *** CORRIGIDO: Passa os 3 parâmetros ***
            search(route.children, path_to_match, newTrail);
          }
        }
      }
    };

    // *** CORRIGIDO: Passa os 3 parâmetros na chamada inicial ***
    search(routes, cleanUrl, []);

    return bestMatch;
  }
}
