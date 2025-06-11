import { TemaRequest } from './../model/tema-request.form';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/tema`;

  getTemas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/buscar-todos`);
  }

  getTemaById(idTema: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/buscar/${idTema}`);
  }

  cadastrarTema(request: TemaRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/adicionar`, request);
  }

  adicionarImagem(idTema: number, imagem: File): Observable<void> {
    const formData = new FormData();
    formData.append('imagem', imagem, imagem.name);
    formData.append('idTema', idTema.toString());
    return this.http.post<void>(`${this.baseUrl}/adicionar-imagem`, formData);
  }

  atualizarTema(temaRequest: TemaRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/atualizar`, temaRequest);
  }

  deletarTema(idTema: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletar/${idTema}`);
  }
}
