import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Acampamento } from '../model/acampamento';
import { environment } from '../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class AcampamentoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/acampamento`;

  buscarAcampamentoBasico(id: any): Observable<Acampamento> {
    return this.http.get<Acampamento>(`${this.baseUrl}/buscar-basico/${id}`);
  }
}
