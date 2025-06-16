import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doacao, NovaDoacaoRequest } from '../model/doacao';
import { environment } from '../../../../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class DoacaoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/doacoes`;

  constructor() {}

  getDoacoesPorAcampamento(idAcampamento: number): Observable<Doacao[]> {
    return this.http.get<Doacao[]>(`${this.baseUrl}/${idAcampamento}`);
  }

  adicionarDoacao(payload: NovaDoacaoRequest): Observable<Doacao> {
    return this.http.post<Doacao>(this.baseUrl, payload);
  }

  deletarDoacao(idDoacao: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idDoacao}`);
  }

  getDadosRelatorioDoacoes(idAcampamento: number): Observable<Doacao[]> {
    return this.http.get<Doacao[]>(
      `${this.baseUrl}/relatorio/${idAcampamento}`
    );
  }
}
