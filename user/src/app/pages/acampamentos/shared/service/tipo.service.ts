import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class TipoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/tipo-acampamento`;

  getTiposDeAcampamento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/buscar-todos`);
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/buscar-categorias`);
  }

  criarTipoAcampamento(request: any): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/criar-tipo-acampamento`,
      request
    );
  }

  deletarTipoAcampamento(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/deletar-tipo-acampamento/${id}`
    );
  }
}
