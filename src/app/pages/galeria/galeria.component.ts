import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-galeria',
  standalone: false,
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss'
})
export class GaleriaComponent implements OnInit {

  galerias: any[] = [
    {
      id: 1,
      title: 'Galeria 1',
      image: 'teste.jpg'
    },
    {
      id: 2,
      title: 'Galeria 2',
      image: 'teste.jpg'
    },
    {
      id: 3,
      title: 'Galeria 3',
      image: 'teste.jpg'
    },
  ]

  ngOnInit(): void {
    const element = document.querySelector('.content') as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      var quantidade = Math.round(rect.width / (170 + 16));
      if(quantidade < this.galerias.length) {
        for(let i = 0; i < quantidade-1; i++) {
          this.galerias.push({});
        }
      }
    }

  }

}
