import { CLIENT } from './../../../../.enviroment';

import {
  Component,
  OnInit,
  HostBinding, // Para adicionar classes ao host
  ElementRef, // Para referência ao elemento
  ChangeDetectorRef, // Para forçar detecção de mudanças
  AfterViewInit, // Para interagir com DOM após renderização
  OnDestroy, // Para limpar o observer
  inject, // Para injeção de dependências moderna
} from '@angular/core';
import {
  CommonModule,
  DatePipe,
  CurrencyPipe,
  DecimalPipe,
} from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Acampamento,
  Acampamentos,
} from '../../shared/model/acampamento/acampamento'; // Ajuste o caminho
import { TipoAcampamento } from '../../../../shared/enum/TipoAcampamento'; // Ajuste o caminho
import { DialogComponent } from '../../../dialog/dialog.component'; // Ajuste o caminho para seu ReusableDialogComponent
import { gerarCodigoAleatorio } from '../../../../shared/utils/code-generator';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, RouterModule, DialogComponent, QRCodeComponent],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
})
export class ListarComponent implements OnInit, AfterViewInit, OnDestroy {
  acampamentos: Acampamentos = [];
  acampamentoSelecionado: Acampamento | null = null;
  mostrarDialogoDetalhes = false;

  // Propriedades para QRCode
  qrCodeData: string | null = null;
  mostrarDialogoQRCode = false;
  acampamentoParaQRCode: Acampamento | null = null;

  @HostBinding('class.container-pequeno') containerPequeno = false;
  @HostBinding('class.container-padrao') containerPadrao = true;

  private elementRef = inject(ElementRef<HTMLElement>);
  private cdr = inject(ChangeDetectorRef);
  private resizeObserver: ResizeObserver | null = null;

  constructor() {}

  ngOnInit(): void {
    this.acampamentos = [
      {
        id: '1',
        code: gerarCodigoAleatorio(), // Gera código aleatório
        dataInicio: '2025-01-15',
        dataFim: '2025-01-19',
        limiteCampistas: 100,
        numeroAtualCampistas: 75,
        limiteEquipeTrabalho: 30,
        tema: {
          descricao: 'Firmes na Fé, Servindo com Amor',
          precoCamisa: 35.0,
          precoInscricao: 150.0,
        },
        tipo: TipoAcampamento.SENIOR,
      },
      {
        id: '2',
        code: gerarCodigoAleatorio(), // Gera código aleatório
        dataInicio: '2025-03-10',
        dataFim: '2025-03-14',
        limiteCampistas: 80,
        numeroAtualCampistas: 80,
        limiteEquipeTrabalho: 25,
        tema: {
          descricao: 'Desperta, tu que dormes!',
          precoCamisa: 30.0,
          precoInscricao: 120.0,
        },
        tipo: TipoAcampamento.FAC,
      },
      {
        id: '3',
        code: gerarCodigoAleatorio(), // Gera código aleatório
        dataInicio: '2025-07-20',
        dataFim: '2025-07-22',
        limiteCampistas: 40,
        numeroAtualCampistas: 32,
        limiteEquipeTrabalho: 15,
        tema: {
          descricao: 'Unidos no Amor de Cristo',
          precoCamisa: 40.0,
          precoInscricao: 250.0,
        },
        tipo: TipoAcampamento.CASAIS,
      },
    ];
  }

  // Lógica do ResizeObserver (mantida)
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

  // Métodos do diálogo de detalhes
  abrirDialogoDetalhes(acamp: Acampamento): void {
    this.acampamentoSelecionado = acamp;
    this.mostrarDialogoDetalhes = true;
  }
  fecharDialogoDetalhes(): void {
    this.mostrarDialogoDetalhes = false;
    this.acampamentoSelecionado = null;
  }

  // Métodos para o diálogo de QRCode
  abrirDialogoQRCode(acamp: Acampamento): void {
    this.acampamentoParaQRCode = acamp;
    this.qrCodeData = `${CLIENT}/formulario?code=${acamp.code}`;
    this.mostrarDialogoQRCode = true;
  }

  fecharDialogoQRCode(): void {
    this.mostrarDialogoQRCode = false;
    this.acampamentoParaQRCode = null;
    this.qrCodeData = null;
  }

  calcularOcupacao(acamp: Acampamento): number {
    if (!acamp.limiteCampistas || acamp.limiteCampistas === 0) return 0;
    return (acamp.numeroAtualCampistas / acamp.limiteCampistas) * 100;
  }
}
