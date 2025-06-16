import {
  Component,
  OnInit,
  HostBinding,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Acampamento, Acampamentos } from '../../shared/model/acampamento';
import { QRCodeComponent } from 'angularx-qrcode';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import { AcampamentoService } from '../../shared/service/acampamento.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../../.enviroment';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImagemService } from '../../shared/service/imagem.service';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogComponent,
    DatePipe,
    QRCodeComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class AcampamentoListarComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  acampamentos: Acampamentos = [];
  acampamentoSelecionado: Acampamento | null = null;
  mostrarDialogoDetalhes = false;

  qrCodeData: string | null = null;
  mostrarDialogoQRCode = false;
  mostrarDialogoArte = false;
  acampamentoParaQRCode: Acampamento | null = null;

  @HostBinding('class.container-pequeno') containerPequeno = false;
  @HostBinding('class.container-padrao') containerPadrao = true;

  private elementRef = inject(ElementRef<HTMLElement>);
  private cdr = inject(ChangeDetectorRef);
  private acampamentoService = inject(AcampamentoService);
  private resizeObserver: ResizeObserver | null = null;
  private sanitizer = inject(DomSanitizer);

  private fb = inject(FormBuilder);
  private imagemService = inject(ImagemService);

  mostrarDialogoUploadZip = false;
  acampamentoParaUpload: Acampamento | null = null;
  formUploadZip!: FormGroup;
  arquivoZipSelecionado: File | null = null;

  constructor() {}

  ngOnInit(): void {
    this.acampamentoService.getAcampamentos().subscribe((data) => {
      this.acampamentos = data;
    });
    this.formUploadZip = this.fb.group({
      ano: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(2000)],
      ],
      arquivo: [null, Validators.required],
    });
  }

  ngAfterViewInit(): void {
    const elementoObservado = this.elementRef.nativeElement.parentElement;
    if (elementoObservado) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          this.atualizarClassesDeContainer(entry.contentRect.width);
        }
      });
      this.resizeObserver.observe(elementoObservado);
      Promise.resolve().then(() =>
        this.atualizarClassesDeContainer(elementoObservado.clientWidth)
      );
    }
  }
  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
  private atualizarClassesDeContainer(width: number): void {
    const ehPequeno = width < 768;
    if (this.containerPequeno !== ehPequeno) {
      this.containerPequeno = ehPequeno;
      this.containerPadrao = !ehPequeno;
      this.cdr.detectChanges();
    }
  }

  abrirDialogoDetalhes(acamp: Acampamento): void {
    this.acampamentoSelecionado = acamp;
    this.mostrarDialogoDetalhes = true;
  }
  fecharDialogoDetalhes(): void {
    this.mostrarDialogoDetalhes = false;
    this.acampamentoSelecionado = null;
  }

  qrCodeImageURL: SafeUrl | null = null;

  abrirDialogoQRCode(acamp: Acampamento): void {
    this.acampamentoParaQRCode = acamp;
    const baseUrl = environment.CLIENT;
    this.qrCodeData = `${baseUrl}/formulario/fun/${acamp.idAcampamento}/${acamp.codigoRegistro}`;
    this.mostrarDialogoQRCode = true;
  }

  fecharDialogoQRCode(): void {
    this.mostrarDialogoQRCode = false;
    this.acampamentoParaQRCode = null;
    this.qrCodeData = null;
    this.qrCodeImageURL = null;
  }
  onQRCodeURL(url: SafeUrl): void {
    this.qrCodeImageURL = url;
  }

  downloadQRCode(): void {
    if (!this.qrCodeImageURL || !this.acampamentoParaQRCode) return;

    const link = document.createElement('a');
    link.href = this.qrCodeImageURL.toString();
    link.download = `qrcode-${this.acampamentoParaQRCode.nomeAcampamento}.png`;
    link.click();
  }

  arteTemaUrl: SafeUrl | null = null;
  private tempObjectUrl: string | null = null;

  abrirDialogoArte(acampamento: Acampamento): void {
    if (!acampamento.tema) {
      return;
    }
    const base64String = acampamento.tema.design;
    let imageUrl;
    if (base64String) imageUrl = `data:image/png;base64,${base64String}`;
    if (imageUrl)
      this.arteTemaUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    this.mostrarDialogoArte = true;
  }

  fecharDialogoArte(): void {
    this.mostrarDialogoArte = false;
    this.arteTemaUrl = null;
  }

  abrirDialogoUploadZip(acampamento: Acampamento): void {
    this.acampamentoParaUpload = acampamento;
    this.formUploadZip.reset({ ano: new Date().getFullYear() });
    this.arquivoZipSelecionado = null;
    this.mostrarDialogoUploadZip = true;
  }

  fecharDialogoUploadZip(): void {
    this.mostrarDialogoUploadZip = false;
  }

  onArquivoZipSelecionado(event: any): void {
    const file = event.target.files[0];
    console.log(file);
    if (file && file.type === 'application/x-zip-compressed') {
      this.arquivoZipSelecionado = file;
      this.formUploadZip.patchValue({ arquivo: file });
    } else {
      alert('Por favor, selecione um arquivo .zip válido.');
      this.formUploadZip.reset({ ...this.formUploadZip.value, arquivo: null });
      this.arquivoZipSelecionado = null;
    }
  }

  enviarZip(): void {
    if (
      this.formUploadZip.invalid ||
      !this.arquivoZipSelecionado ||
      !this.acampamentoParaUpload
    ) {
      alert('Por favor, preencha o ano e selecione um arquivo .zip.');
      return;
    }

    const ano = this.formUploadZip.get('ano')?.value;

    this.imagemService
      .uploadZip(
        this.acampamentoParaUpload.idAcampamento,
        ano,
        this.arquivoZipSelecionado
      )
      .subscribe({
        next: () => {
          alert('Arquivo enviado com sucesso!');
          this.fecharDialogoUploadZip();
        },
        error: (err) => {
          alert('Ocorreu um erro ao enviar o arquivo.');
          console.error(err);
        },
      });
  }
}
