import { TemaRequest } from './../model/tema-request.form';
import { inject, Injectable } from '@angular/core';
import { Acampamento, Acampamentos } from '../model/acampamento';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../.enviroment';
import { HttpClient } from '@angular/common/http';
import { AcampamentoRequest } from '../model/acampamento-request.form';
import { TemaService } from './tema.service';

@Injectable({
  providedIn: 'root',
})
export class AcampamentoService {
  public SERVICE_TEMA = inject(TemaService);

  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/acampamento`;

  getAcampamentos(): Observable<Acampamentos> {
    return this.http.get<Acampamentos>(`${this.baseUrl}/buscar-todos`);
  }

  getAcampamentoBasicoPorId(idAcampamento: number) {
    return this.http.get<Acampamento>(
      `${this.baseUrl}/buscar-basico/${idAcampamento}`
    );
  }

  getAcampamentoCompleto(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/buscar-completo/${id}`);
  }

  adicionarAcampamento(request: any) {
    this.SERVICE_TEMA.adicionarTema(
      new TemaRequest(
        request.descricao,
        request.precoCamisa,
        request.precoInscricao
      )
    ).subscribe((success: number) => {
      request = new AcampamentoRequest(request, success);
      this.http.post<any>(`${this.baseUrl}/adicionar`, request).subscribe(
        (success) => {
          window.location.reload();
        },
        (error) => console.log(error)
      );
    });
  }

  adicionarAcampamentoComTemaExistente(request: any) {
    request = new AcampamentoRequest(request, request.idTema);
    this.http.post<any>(`${this.baseUrl}/adicionar`, request).subscribe(
      (success) => {
        window.location.reload();
      },
      (error) => console.log(error)
    );
  }
}
