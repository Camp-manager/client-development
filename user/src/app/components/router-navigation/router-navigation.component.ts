import { Component, Input } from '@angular/core'; // Removido OnChanges se não for mais usado
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { RouterHelpers } from '../../shared/model/RouterHelper';

@Component({
  selector: 'router-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    RouterNavigationComponent,
  ],
  templateUrl: './router-navigation.component.html',
  styleUrls: ['./router-navigation.component.scss'],
})
export class RouterNavigationComponent {
  @Input() rotas: RouterHelpers = [];
  @Input() isSubmenu: boolean = false;
  @Input() isMinimized: boolean = false; // Novo Input
}
