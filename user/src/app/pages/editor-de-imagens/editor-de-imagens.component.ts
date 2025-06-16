import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fabric } from 'fabric';
import { ActivatedRoute, Router } from '@angular/router';
import { AcampamentoService } from '../acampamentos/shared/service/acampamento.service';
import { TemaService } from '../acampamentos/shared/service/tema.service';

@Component({
  selector: 'app-editor-de-imagens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor-de-imagens.component.html',
  styleUrls: ['./editor-de-imagens.component.scss'],
})
export class EditorDeImagensComponent implements AfterViewInit, OnInit {
  private canvas!: fabric.Canvas;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private acampamentoService = inject(AcampamentoService);
  private temaService = inject(TemaService);

  arquivoSelecionado: File | null = null;

  idTemaParaUpload!: number;

  isUploading = false;
  mensagem: string | null = null;

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('canvas-editor', {
      backgroundColor: '#ffffff',
      selectionBorderColor: '#4A80C6',
      selectionColor: 'rgba(74, 128, 198, 0.3)',
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has('idAcampamento')) {
        const id = Number(params.get('idAcampamento'));
        this.carregarDadosDoAcampamento(id);
      } else {
        this.acampamentoService.getProximoAcampamento().subscribe({
          next: (proximoAcampamento) => {
            console.log(proximoAcampamento);
            if (proximoAcampamento) {
              this.router.navigate(
                ['/editar', proximoAcampamento.idAcampamento],
                { replaceUrl: true }
              );
              this.idTemaParaUpload = proximoAcampamento.tema.id;
            }
          },
        });
      }
    });
  }

  onArquivoSelecionado(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.arquivoSelecionado = fileList[0];
      this.mensagem = null;
    }
  }

  carregarDadosDoAcampamento(id: number): void {
    this.acampamentoService.getAcampamentoBasicoPorId(id).subscribe({
      next: (proximoAcampamento) => {
        if (proximoAcampamento) {
          this.idTemaParaUpload = proximoAcampamento.tema.id;
        }
      },
    });
  }

  adicionarCamiseta(): void {
    fabric.Image.fromURL(
      'editor/camiseta-template.png',
      (img: any) => {
        img.scaleToWidth(300);
        this.canvas.add(img);
        this.canvas.centerObject(img);
        this.canvas.renderAll();
      },
      { crossOrigin: 'anonymous' }
    );
  }

  adicionarTexto(): void {
    const text = new fabric.Textbox('Edite este texto', {
      left: 50,
      top: 50,
      width: 200,
      fontSize: 24,
      fill: '#333',
      fontFamily: 'Inter',
    });
    this.canvas.add(text);
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      fabric.Image.fromURL(dataUrl, (img: any) => {
        img.scaleToWidth(250);
        this.canvas.add(img);
        this.canvas.centerObject(img);
        this.canvas.renderAll();
      });
    };

    reader.readAsDataURL(file);
  }

  salvarComoImagem(): void {
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 3,
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'minha-arte-alta-resolucao.png';
    link.click();
  }

  salvarArteNoServidor(): void {
    if (!this.idTemaParaUpload) {
      alert('Nenhum tema foi selecionado para associar a imagem.');
      return;
    }

    // 1. Gera a imagem do canvas em alta resolução
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 3,
    });

    // 2. Converte a imagem gerada (dataURL) em um objeto File
    const nomeDoArquivo = `arte-tema-${
      this.idTemaParaUpload
    }-${Date.now()}.png`;
    const arquivoDaArte = this.dataURLtoFile(dataURL, nomeDoArquivo);

    if (!arquivoDaArte) {
      alert('Não foi possível processar a imagem para o envio.');
      return;
    }

    // 3. Usa a lógica de upload com o arquivo gerado
    this.isUploading = true;
    this.mensagem = null;

    this.temaService
      .adicionarImagem(this.idTemaParaUpload, arquivoDaArte)
      .subscribe({
        next: () => {
          this.isUploading = false;
          this.mensagem = 'Arte enviada e salva no tema com sucesso!';
          this.router.navigate(['/acampamentos']);
        },
        error: (err) => {
          this.isUploading = false;
          this.mensagem = 'Erro ao enviar a arte. Tente novamente.';
          console.error(err);
        },
      });
  }

  private dataURLtoFile(dataurl: string, filename: string): File | null {
    try {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) return null;

      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      console.error('Erro ao converter dataURL para File:', e);
      return null;
    }
  }
}
