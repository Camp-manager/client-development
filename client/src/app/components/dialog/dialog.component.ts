import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'dialog',
  standalone: true, // Add standalone: true
  imports: [CommonModule], // Add CommonModule for @if directive
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Input() isOpen: boolean = false;
  @Input() dialogTitle?: string;
  @Input() hideCloseButton: boolean = false;
  @Input() disableOverlayClose: boolean = false;

  @Output() close = new EventEmitter<void>();

  private elementRef = inject(ElementRef);

  // Unique ID for ARIA attributes
  public readonly uniqueId =
    'dialog-' + Math.random().toString(36).substring(2, 9);

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && !this.disableOverlayClose) {
      // Consider disableOverlayClose for escape
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

  // Prevent click inside dialog from closing it
  onDialogCardClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Check if ng-content for header is provided
  hasProjectedHeader(): boolean {
    const headerElement =
      this.elementRef.nativeElement.querySelector('[dialog-header]');
    return !!headerElement && headerElement.childNodes.length > 0;
  }

  // Check if ng-content for footer is provided
  hasProjectedFooter(): boolean {
    const footerElement =
      this.elementRef.nativeElement.querySelector('[dialog-footer]');
    return !!footerElement && footerElement.childNodes.length > 0;
  }
}
