import { TemaRequest } from './../model/tema-request.form';
import { inject, Injectable } from '@angular/core';
import { Acampamentos } from '../model/acampamento';
import { Observable, of } from 'rxjs';
import { SERVER } from '../../../../../.enviroment';
import { HttpClient } from '@angular/common/http';
import { AcampamentoRequest } from '../model/acampamento-request.form';
import { TemaService } from './tema.service';

@Injectable({
  providedIn: 'root',
})
export class AcampamentoService {
  private API = `${SERVER}/acampamento`;

  public SERVICE_TEMA = inject(TemaService);

  constructor(private http: HttpClient) {}

  getAcampamentos(): Observable<Acampamentos> {
    return this.http.get<Acampamentos>(`${this.API}/buscar-todos`);
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
      this.http.post<any>(`${this.API}/adicionar`, request).subscribe(
        (success) => {
          return success;
        },
        (error) => console.log(error)
      );
    });
  }
}
