import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../../../../../.enviroment';
import { DiretorioDeImagensDTO } from '../model/imagem.dto';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.API}/imagens`;

  getTodosDiretorios(): Observable<DiretorioDeImagensDTO[]> {
    return this.http.get<DiretorioDeImagensDTO[]>(
      `${this.baseUrl}/buscar-todas`
    );
  }

  getDiretorioPorNome(
    nomeAcampamento: string
  ): Observable<DiretorioDeImagensDTO | undefined> {
    return this.getTodosDiretorios().pipe(
      map((todosOsDiretorios) =>
        todosOsDiretorios.find(
          (dir) => dir.nomeDoAcampamento === nomeAcampamento
        )
      )
    );
  }
}
