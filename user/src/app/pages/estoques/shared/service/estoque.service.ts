import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../.enviroment';
import { AdicionarItensRequest, EstoqueDTO } from '../model/estoque.dto';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/estoque`;

  buscarTodosEstoques(): Observable<EstoqueDTO[]> {
    return this.http.get<EstoqueDTO[]>(`${this.baseUrl}/buscar-estoque`);
  }

  adicionarItens(request: AdicionarItensRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/adicionar-itens`, request);
  }
}
