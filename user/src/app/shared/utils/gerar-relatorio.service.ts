import { Injectable, inject, Type, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class GerarRelatorioService {
  private apiUrl = `${environment.API_REPORTS}/gerar-pdf.php`;
  private http = inject(HttpClient);

  // private readonly RELATORIO_CSS = `
  //       body {
  //           font-family: Arial, sans-serif;
  //           background-color: #f4f4f9;
  //           color: #333;
  //           line-height: 1.6;
  //           margin: 0;
  //           padding: 20px;

  //       }

  //       .report-container {

  //           max-width: 900px;

  //           margin: 0 auto;

  //           background-color: #fff;

  //           padding: 30px;

  //           border-radius: 8px;

  //           box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  //       }

  //       header {

  //           text-align: center;

  //           border-bottom: 2px solid #4A80C6;

  //           padding-bottom: 20px;

  //           margin-bottom: 20px; /* Reduzido para aproximar da linha de corte */

  //       }

  //       header h2 {

  //           margin: 0;

  //           color: #4A80C6;

  //       }

  //       header p {

  //           margin: 5px 0 0;

  //           color: #777;

  //       }

  //       .cut-here-container {

  //           display: flex;

  //           align-items: center;

  //           gap: 15px;

  //           margin-bottom: 30px;

  //           color: #aaa;

  //       }

  //       .cut-here-container .icon {

  //           font-size: 1.5em; /* Tamanho dos ícones */

  //       }

  //       .cut-here-container .cut-line {

  //           flex-grow: 1; /* Faz a linha ocupar todo o espaço disponível */

  //           border-bottom: 2px dashed #ccc; /* Linha tracejada para o recorte */

  //       }

  //       .section {

  //           margin-bottom: 40px;

  //       }

  //       .team-block {

  //           margin-bottom: 25px;

  //           border: 1px solid #ddd;

  //           border-radius: 5px;

  //           overflow: hidden;

  //       }

  //       .team-name {

  //           background-color: #4A80C6;

  //           color: #fff;

  //           padding: 10px 15px;

  //           font-size: 1.2em;

  //           margin: 0;

  //       }

  //       table {

  //           width: 100%;

  //           border-collapse: collapse;

  //           margin-top: 0;

  //       }

  //       th, td {

  //           padding: 12px 15px;

  //           text-align: left;

  //           border-bottom: 1px solid #ddd;

  //       }

  //       thead tr {

  //           background-color: #f2f2f2;

  //           font-weight: bold;

  //       }

  //       tbody tr:last-child td {

  //           border-bottom: none;

  //       }

  //       @media print {
  //         body {
  //             background-color: #fff;
  //         }
  //         .report-container {
  //             box-shadow: none;
  //             padding: 0;
  //             border: none;
  //         }

  //         thead {
  //             display: table-header-group;
  //         }

  //         .team-block, tr {
  //             page-break-inside: avoid;
  //             break-inside: avoid;
  //         }

  //         h2, h3, .team-name {
  //             page-break-after: avoid; /* Propriedade legada */
  //             break-after: avoid;      /* Propriedade moderna */
  //         }
  //     }
  // `;

  private readonly RELATORIO_CSS = `
    body {
        font-family: 'Inter', Arial, sans-serif;
        font-size: 12pt;
        background-color: #fff;
        color: #212529;
        line-height: 1.5;
        margin: 0;
    }
    .report-container {
        padding: 20px;
    }
    header {
        text-align: center;
        border-bottom: 2px solid #4A80C6;
        padding-bottom: 15px;
        margin-bottom: 30px;
    }
    header h1 {
        margin: 0 0 5px 0;
        color: #4A80C6;
        font-size: 24pt;
        font-weight: bold;
    }
    header p {
        margin: 0;
        font-size: 10pt;
        color: #6c757d;
    }
    .section {
        margin-bottom: 35px;
    }
    .section-title {
        font-size: 16pt;
        color: #343a40;
        border-bottom: 1px solid #dee2e6;
        padding-bottom: 8px;
        margin-bottom: 20px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
    }
    thead th {
        background-color: #f8f9fa;
        font-weight: bold;
        color: #495057;
        text-transform: uppercase;
        font-size: 10pt;
        letter-spacing: 0.5px;
    }
    tbody tr:nth-child(even) {
        background-color: #f8f9fa;
    }
    .team-block {
        margin-bottom: 25px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
    }
    .team-name {
        background-color: #4A80C6;
        color: #fff;
        padding: 12px 15px;
        font-size: 14pt;
        font-weight: bold;
        margin: 0;
    }
    .cut-here-container {
        display: flex;
        align-items: center;
        gap: 15px;
        margin: 20px 0;
        color: #adb5bd;
    }
    .cut-here-container .cut-line {
        flex-grow: 1;
        border-bottom: 2px dashed #ced4da;
    }
    @media print {
        thead {
            display: table-header-group; /* Repete o cabeçalho em cada nova página */
        }
        .team-block, tr {
            page-break-inside: avoid;
            break-inside: avoid;
        }
        h1, h2, h3 {
            page-break-after: avoid;
            break-after: avoid;
        }
    }
  `;

  constructor() {}

  private generateBlob(htmlContent: string): Promise<Blob> {
    const request$ = this.http.post(this.apiUrl, htmlContent, {
      responseType: 'blob',
    });
    return firstValueFrom(request$);
  }

  public async generatePdf<T>(
    component: Type<T>,
    container: ViewContainerRef,
    data?: Partial<T>,
    fileName: string = 'relatorio.pdf'
  ): Promise<void> {
    container.clear();
    const componentRef = container.createComponent(component);

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        (componentRef.instance as any)[key] = value;
      });
    }

    componentRef.changeDetectorRef.detectChanges();
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const componentHtml = componentRef.location.nativeElement.innerHTML;
    componentRef.destroy();

    // 2. O método agora usa a constante de CSS para montar o HTML final.
    const finalHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Relatório</title>
          <style>
            ${this.RELATORIO_CSS}
          </style>
        </head>
        <body>
          ${componentHtml}
        </body>
      </html>
    `;

    try {
      const responseBlob = await this.generateBlob(finalHtml);

      const blob = new Blob([responseBlob], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Erro ao gerar o PDF:', err);
      alert('Ocorreu um erro ao gerar o relatório. Tente novamente.');
    }
  }
}
