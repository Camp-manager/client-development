import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GaleriaService } from './shared/service/galeria.service';
import { DiretorioDeImagensDTO } from './shared/model/imagem.dto';

@Component({
  selector: 'app-galeria',
  standalone: false,
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
})
export class GaleriaComponent implements OnInit {
  private galeriaService = inject(GaleriaService);
  private sanitizer = inject(DomSanitizer);

  // NOVO: Controle de visualização
  modoDeExibicao: 'lista' | 'detalhes' = 'lista';

  galerias: DiretorioDeImagensDTO[] = [];
  albumSelecionado: DiretorioDeImagensDTO | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.galeriaService.getTodosDiretorios().subscribe({
      next: (data) => {
        this.galerias = data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  getImagemDeCapa(base64String: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      `data:image/jpeg;base64,${base64String}`
    );
  }

  mostrarDetalhes(album: DiretorioDeImagensDTO): void {
    this.albumSelecionado = album;
    this.modoDeExibicao = 'detalhes';
  }

  mostrarLista(): void {
    this.albumSelecionado = null;
    this.modoDeExibicao = 'lista';
  }
  getImagemRelativa(pathAbsoluto: string): string {
    console.log(pathAbsoluto);
    const basePath =
      'file:///C:/Users/guilh/OneDrive/Documentos/camp-manager/client-development/client/public/';
    let path = pathAbsoluto.replace(basePath, '');
    return path;
  }
}
