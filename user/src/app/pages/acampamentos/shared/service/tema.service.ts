import { TemaRequest } from './../model/tema-request.form';
import { Injectable } from '@angular/core';
import { SERVER } from '../../../../../.enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  private API = `${SERVER}/tema`;

  constructor(private http: HttpClient) {}

  adicionarTema(request: TemaRequest) {
    return this.http.post<number>(`${this.API}/adicionar`, request);
  }
}
