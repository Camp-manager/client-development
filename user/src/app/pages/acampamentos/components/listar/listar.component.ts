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
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../../.enviroment';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogComponent,
    DatePipe,
    QRCodeComponent,
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
  acampamentoParaQRCode: Acampamento | null = null;

  @HostBinding('class.container-pequeno') containerPequeno = false;
  @HostBinding('class.container-padrao') containerPadrao = true;

  private elementRef = inject(ElementRef<HTMLElement>);
  private cdr = inject(ChangeDetectorRef);
  private acampamentoService = inject(AcampamentoService);
  private resizeObserver: ResizeObserver | null = null;

  constructor() {}

  ngOnInit(): void {
    this.acampamentoService.getAcampamentos().subscribe((data) => {
      this.acampamentos = data;
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
}
