import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-nossa-historia',
  templateUrl: './nossa-historia.component.html',
  styleUrl: './nossa-historia.component.scss'
})
export class NossaHistoriaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const elementoConteudo = document.querySelector('.scroll');
    if (elementoConteudo) {
      elementoConteudo.scrollTop = elementoConteudo.scrollHeight;
    }
  }


}
