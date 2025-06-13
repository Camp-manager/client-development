import { environment } from './../../../../../../../.enviroment';
import { TemaRequest } from './../model/tema-request.form';
import { inject, Injectable } from '@angular/core';
import { Acampamento, Acampamentos } from '../model/acampamento';
import { Observable, of } from 'rxjs';
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

  getProximoAcampamento() {
    return this.http.get<Acampamento>(`${this.baseUrl}/proximo`);
  }

  getAcampamentoCompleto(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/buscar-completo/${id}`);
  }

  adicionarAcampamento(request: AcampamentoRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/adicionar`, request);
  }
}
