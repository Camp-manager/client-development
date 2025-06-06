import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cronograma, Cronogramas } from '../model/cronograma';

@Injectable({
  providedIn: 'root',
})
export class CronogramaService {
  private mockCronogramas: Cronogramas = [];
  private nextId = 1;

  constructor() {}

  getCronogramasByAcampamento(idAcampamento: string): Observable<Cronogramas> {
    return of(
      this.mockCronogramas.filter((c) => c.idAcampamento === idAcampamento)
    ).pipe(delay(300));
  }

  getCronogramaById(id: string): Observable<Cronograma | undefined> {
    return of(this.mockCronogramas.find((c) => c.id === id)).pipe(delay(300));
  }

  salvarCronograma(
    cronogramaData: Omit<Cronograma, 'id'>
  ): Observable<Cronograma> {
    const novoCronograma: Cronograma = {
      ...cronogramaData,
      id: `cron${this.nextId++}`,
    };
    this.mockCronogramas.push(novoCronograma);
    console.log('Cronograma salvo (mock):', novoCronograma);
    return of(novoCronograma).pipe(delay(500));
  }

  atualizarCronograma(
    id: string,
    cronogramaData: Partial<Cronograma>
  ): Observable<Cronograma | undefined> {
    const index = this.mockCronogramas.findIndex((c) => c.id === id);
    if (index > -1) {
      this.mockCronogramas[index] = {
        ...this.mockCronogramas[index],
        ...cronogramaData,
      };
      console.log('Cronograma atualizado (mock):', this.mockCronogramas[index]);
      return of(this.mockCronogramas[index]).pipe(delay(500));
    }
    return of(undefined);
  }
}
