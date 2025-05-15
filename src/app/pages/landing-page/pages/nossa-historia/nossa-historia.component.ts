import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-nossa-historia',
  templateUrl: './nossa-historia.component.html',
  styleUrl: './nossa-historia.component.scss'
})
export class NossaHistoriaComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    const galeriaElement = this.elementRef.nativeElement.querySelector('.container') as HTMLElement;

    if (galeriaElement) {
      galeriaElement.scrollTop = galeriaElement.scrollHeight;
    }
  }


}
