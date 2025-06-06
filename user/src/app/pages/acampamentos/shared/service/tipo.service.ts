import { Injectable } from '@angular/core';
import { SERVER } from '../../../../../.enviroment';
import { HttpClient } from '@angular/common/http';
import { TipoAcampamento } from '../model/acampamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TipoService {
  private API = `${SERVER}/tipo-acampamento`;

  constructor(private http: HttpClient) {}

  buscarTodosTipo(): Observable<TipoAcampamento[]> {
    return this.http.get<TipoAcampamento[]>(`${this.API}/buscar-todos`);
  }
}
