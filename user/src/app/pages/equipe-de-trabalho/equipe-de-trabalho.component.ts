import { Component, inject } from '@angular/core';
import { MembrosEquipe } from './shared/model/membro-equipe';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-equipe-de-trabalho',
  imports: [RouterModule],
  templateUrl: './equipe-de-trabalho.component.html',
  styleUrl: './equipe-de-trabalho.component.scss',
})
export class EquipeDeTrabalhoComponent {
  private route = inject(ActivatedRoute);

  acampamentoCode: string | null = null;
  equipe: MembrosEquipe = [];
  isLoading = true;
  error: string | null = null;

  private todosOsMembros: MembrosEquipe = [
    {
      id: 'tm1',
      nome: 'Carlos Silva',
      funcao: 'Teatro',
      acampamentoCode: 'ABC12',
      telefone: '11999998888',
      email: 'carlos@email.com',
    },
    {
      id: 'tm2',
      nome: 'Ana Pereira',
      funcao: 'Teatro',
      acampamentoCode: 'ABC12',
      telefone: '11999997777',
      email: 'ana@email.com',
    },
    {
      id: 'tm3',
      nome: 'João Santos',
      funcao: 'Cozinheiro',
      acampamentoCode: 'XYZ78',
      telefone: '11999996666',
      email: 'joao@email.com',
    },
    {
      id: 'tm4',
      nome: 'Maria Oliveira',
      funcao: 'Lider',
      acampamentoCode: 'ABC12',
      telefone: '11999995555',
      email: 'maria@email.com',
    },
    {
      id: 'tm5',
      nome: 'Pedro Costa',
      funcao: 'Lider',
      acampamentoCode: 'XYZ78',
      telefone: '11999994444',
      email: 'pedro@email.com',
    },
    {
      id: 'tm6',
      nome: 'Juliana Almeida',
      funcao: 'Enfermeira',
      acampamentoCode: 'ABC12',
      email: 'juliana@email.com',
    },
  ];

  ngOnInit(): void {
    this.acampamentoCode = this.route.snapshot.paramMap.get('acampamentoCode');
    if (this.acampamentoCode) {
      this.carregarEquipe(this.acampamentoCode);
    } else {
      this.error = 'Código do acampamento não fornecido.';
      this.isLoading = false;
    }
  }

  carregarEquipe(code: string): void {
    this.isLoading = true;
    this.error = null;
    setTimeout(() => {
      this.equipe = this.todosOsMembros.filter(
        (membro) => membro.acampamentoCode === code
      );
      if (this.equipe.length === 0 && this.acampamentoCode) {
        const campExistsWithCode = this.todosOsMembros.some(
          (m) => m.acampamentoCode === this.acampamentoCode
        );
        if (
          !campExistsWithCode &&
          this.acampamentoCode !== 'ABC12' &&
          this.acampamentoCode !== 'XYZ78'
        ) {
          this.error = `Nenhum acampamento encontrado com o código '${this.acampamentoCode}'.`;
        }
      }
      this.isLoading = false;
    }, 500);
  }
}
