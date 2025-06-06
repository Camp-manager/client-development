import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Campistas } from '../model/campista';

@Injectable({
  providedIn: 'root',
})
export class CampistaService {
  private mockCampistas: Campistas = [
    {
      id: 'camp1',
      id_acampamento: 'ABC12',
      pessoa: {
        id: 'p1',
        nomeCompleto: 'João da Silva Sauro',
        dataNascimento: '2005-06-10',
        sexo: 'M',
        peso: 70,
        altura: 175,
        batizada: 'S',
        primeiraComunhao: 'S',
        telefone: '18999990001',
      },
      usaMedicamento: 'N',
      isAlergico: 'S',
      alergias: 'Amendoim, Camarão',
      jaAcampou: 'S',
      acampamentosJaFeitos: 'FAC Jovem 2022',
      temBarraca: 'S',
    },
    {
      id: 'camp2',
      id_acampamento: 'ABC12',
      pessoa: {
        id: 'p2',
        nomeCompleto: 'Maria Pereira Oliveira',
        dataNascimento: '2006-01-22',
        sexo: 'F',
        batizada: 'S',
        peso: 70,
        altura: 175,
        primeiraComunhao: 'N',
        telefone: '18999990002',
      },
      usaMedicamento: 'S',
      medicamentos: [
        {
          id: 'med1',
          nome: 'Loratadina 10mg',
          quantidade: '1cp ao dia',
          tipo: 'C',
        },
      ],
      isAlergico: 'N',
      jaAcampou: 'N',
      temBarraca: 'N',
    },
    {
      id: 'camp3',
      id_acampamento: 'XYZ78',
      pessoa: {
        id: 'p3',
        nomeCompleto: 'Pedro Martins Andrade',
        dataNascimento: '2007-11-05',
        sexo: 'M',
        batizada: 'N',
        peso: 70,
        altura: 175,
        primeiraComunhao: 'N',
        telefone: '18999990003',
      },
      usaMedicamento: 'N',
      isAlergico: 'N',
      jaAcampou: 'S',
      acampamentosJaFeitos: 'Mirim 2019',
      temBarraca: 'S',
    },
    {
      id: 'camp4',
      id_acampamento: 'PAST01',
      pessoa: {
        id: 'p4',
        nomeCompleto: 'Ana Clara Souza',
        dataNascimento: '2004-02-15',
        sexo: 'F',
        batizada: 'S',
        peso: 70,
        altura: 175,
        primeiraComunhao: 'S',
        telefone: '18999990004',
      },
      usaMedicamento: 'N',
      isAlergico: 'S',
      alergias: 'Pólen',
      jaAcampou: 'S',
      acampamentosJaFeitos: 'Senior 2021, FAC 2022',
      temBarraca: 'S',
    },
  ];

  constructor() {}

  getCampistasByAcampamentoCode(
    acampamentoCode: string
  ): Observable<Campistas> {
    const filteredCampistas = this.mockCampistas.filter(
      (c) => c.id_acampamento === acampamentoCode
    );
    return of(filteredCampistas);
  }
}
