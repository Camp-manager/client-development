import {
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  inject,
  Type,
} from '@angular/core';

@Directive({
  selector: '[appDynamicContent]',
  standalone: true,
})
export class DynamicContentDirective implements OnInit {
  private viewContainerRef = inject(ViewContainerRef);

  @Input('appDynamicContent') component: Type<any> | null = null;

  ngOnInit(): void {
    if (!this.component) {
      return;
    }

    this.viewContainerRef.clear();

    this.viewContainerRef.createComponent(this.component);
  }
}
