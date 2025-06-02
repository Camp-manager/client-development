import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, Type } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { asyncScheduler, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GerarRelatorioService {
  private apiUrl = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    private resolver: ComponentFactoryResolver
  ) {}

  // Método para gerar o PDF com o HTML
  private generateBlob(htmlContent: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Content-Type', 'text/html');
    return this.http.post(`${this.apiUrl}/gerar-pdf.php`, htmlContent, {
      headers: headers,
      responseType: 'blob',
    });
  }

  public generatePdf(component: Type<any>, container: ViewContainerRef) {
    container.clear();
    const factory: ComponentFactory<any> =
      this.resolver.resolveComponentFactory(component);

    const componentRef = container.createComponent(factory);
    componentRef.instance.title = 'Injected Title';

    asyncScheduler.schedule(() => {
      const htmlString = componentRef.location.nativeElement.innerHTML;
      componentRef.destroy();
      this.generateBlob(htmlString).subscribe((response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'teste.pdf';
        link.click();
      });
    });
  }
}
