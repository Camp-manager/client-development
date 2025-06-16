import { Acampamento } from './../../../../../../shared/model/acampamento';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../../../../../.enviroment';

@Injectable({
  providedIn: 'root',
})
export class AcampamentoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/acampamento`;

  getProximoAcampamento(): Observable<Acampamento> {
    return this.http.get<Acampamento>(`${this.baseUrl}/proximo`);
  }
}
