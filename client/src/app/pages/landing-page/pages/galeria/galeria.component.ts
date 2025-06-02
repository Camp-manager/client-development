import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
      images: [
        {path: 'teste.jpg', title: 'Teste 1', isCapa: true},
        {path: 'teste.jpg', title: 'Teste 2'},
        {path: 'teste.jpg', title: 'Teste 3'}
      ]
    },
    {
      id: 2,
      title: 'Galeria 2',
      images: [
        {path: 'teste.jpg', title: 'Teste 1'},
        {path: 'teste.jpg', title: 'Teste 2'},
        {path: 'teste.jpg', title: 'Teste 3', isCapa: true}
      ]
    },
    {
      id: 3,
      title: 'Galeria 3',
      images: [
        {path: 'teste.jpg', title: 'Teste 1'},
        {path: 'teste.jpg', title: 'Teste 2', isCapa: true}
      ]
    },{
      id: 1,
      title: 'Galeria 1',
      images: [
        {path: 'teste.jpg', title: 'Teste 1', isCapa: true},
        {path: 'teste.jpg', title: 'Teste 2'},
        {path: 'teste.jpg', title: 'Teste 3'}
      ]
    },
    {
      id: 2,
      title: 'Galeria 2',
      images: [
        {path: 'teste.jpg', title: 'Teste 1'},
        {path: 'teste.jpg', title: 'Teste 2'},
        {path: 'teste.jpg', title: 'Teste 3', isCapa: true}
      ]
    },
    {
      id: 3,
      title: 'Galeria 3',
      images: [
        {path: 'teste.jpg', title: 'Teste 1'},
        {path: 'teste.jpg', title: 'Teste 2', isCapa: true}
      ]
    },{
      id: 1,
      title: 'Galeria 1',
      images: [
        {path: 'teste.jpg', title: 'Teste 1', isCapa: true},
        {path: 'teste.jpg', title: 'Teste 2'},
        {path: 'teste.jpg', title: 'Teste 3'}
      ]
    },
    {
      id: 2,
      title: 'Galeria 2',
      images: [
        {path: 'teste.jpg', title: 'Teste 1'},
        {path: 'teste.jpg', title: 'Teste 2'},
        {path: 'teste.jpg', title: 'Teste 3', isCapa: true}
      ]
    },
    {
      id: 3,
      title: 'Galeria 3',
      images: [
        {path: 'teste.jpg', title: 'Teste 1'},
        {path: 'teste.jpg', title: 'Teste 2', isCapa: true}
      ]
    },
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
    const element = document.querySelector('.galeria') as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      var quantidadeDeElementos = this.galerias.length;
      var quantidade = Math.floor(rect.width / (170 + 16));
      for(; quantidadeDeElementos%quantidade != 0; quantidadeDeElementos++) {
        this.galerias.push({});
      }
    }
  }

  openGaleria(galeria: any) {
    this.router.navigate(['galeria', galeria.id]);
  }

}
