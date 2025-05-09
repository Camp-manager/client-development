import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrl: './detalhes.component.scss'
})
export class DetalhesComponent implements OnInit {
  galeriaId!: number;
  galeria: any;
  selectedIndex: number = 0;

  galerias = [
    {
      id: 1,
      title: 'Galeria 1',
      images: [
        { id: 1, path: 'teste.jpg', title: 'Teste 1', isCapa: true },
        { id: 2, path: 'teste.jpg', title: 'Teste 2' },
        { id: 3, path: 'teste.jpg', title: 'Teste 3' },
        { id: 4, path: 'right.png', title: 'Teste 1' },
        { id: 5, path: 'teste.jpg', title: 'Teste 2' },
        { id: 6, path: 'teste.jpg', title: 'Teste 3' },
        { id: 7, path: 'teste.jpg', title: 'Teste 1' },
        { id: 8, path: 'teste.jpg', title: 'Teste 2' },
        { id: 9, path: 'teste.jpg', title: 'Teste 3' },
        { id: 10, path: 'teste.jpg', title: 'Teste 1' },
        { id: 11, path: 'teste.jpg', title: 'Teste 2' },
        { id: 12, path: 'teste.jpg', title: 'Teste 3' }
      ]
    },
    {
      id: 2,
      title: 'Galeria 2',
      images: [
        { id: 1, path: 'teste.jpg', title: 'Teste 1', isCapa: true },
        { id: 2, path: 'teste.jpg', title: 'Teste 2' },
        { id: 3, path: 'teste.jpg', title: 'Teste 3' }
      ]
    },
    {
      id: 3,
      title: 'Galeria 3',
      images: [
        { id: 1, path: 'teste.jpg', title: 'Teste 1', isCapa: true },
        { id: 3, path: 'teste.jpg', title: 'Teste 3' }
      ]
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.galeriaId = Number(this.route.snapshot.paramMap.get('id'));
    this.galeria = this.galerias.find(g => g.id === this.galeriaId);
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }

  downloadImage(imagePath: string): void {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = this.getFileNameFromPath(imagePath);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getFileNameFromPath(path: string): string {
    return path.split('/').pop() || 'imagem.jpg';
  }

  returnPage() {
    this.router.navigate(['/galeria']);
  }

}
