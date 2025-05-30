import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Input() isOpen: boolean = false;
  @Input() dialogTitle?: string; // Título opcional via Input
  @Input() hideCloseButton: boolean = false; // Para esconder o 'X' se necessário
  @Input() disableOverlayClose: boolean = false; // Para impedir fechar ao clicar no overlay

  @Output() close = new EventEmitter<void>();

  private elementRef = inject(ElementRef);

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.closeDialog();
    }
  }

  closeDialog(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (
      !this.disableOverlayClose &&
      event.target ===
        this.elementRef.nativeElement.querySelector('.dialog-overlay')
    ) {
      this.closeDialog();
    }
  }

  onDialogCardClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  public readonly uniqueId = Math.random().toString(36).substring(2);

  hasProjectedHeader(): boolean {
    const headerElement =
      this.elementRef.nativeElement.querySelector('[dialog-header]');
    return !!headerElement && headerElement.childNodes.length > 0;
  }

  hasProjectedFooter(): boolean {
    const footerElement =
      this.elementRef.nativeElement.querySelector('[dialog-footer]');
    return !!footerElement && footerElement.childNodes.length > 0;
  }
}
