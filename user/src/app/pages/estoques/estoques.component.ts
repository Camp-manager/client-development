import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { EstoqueService } from './shared/service/estoque.service';
import { EstoqueDTO, ItemRequest } from './shared/model/estoque.dto';

@Component({
  selector: 'app-estoques',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogComponent],
  templateUrl: './estoques.component.html',
  styleUrls: ['./estoques.component.scss'],
})
export class EstoquesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private estoqueService = inject(EstoqueService);

  estoques: EstoqueDTO[] = [];
  isLoading = true;

  mostrarDialogoAdicionarItens = false;
  formAdicionarItens!: FormGroup;
  estoqueSelecionado: EstoqueDTO | null = null;

  ngOnInit(): void {
    this.carregarEstoques();
    this.inicializarFormAdicionarItens();
  }

  carregarEstoques(): void {
    this.isLoading = true;
    this.estoqueService.buscarTodosEstoques().subscribe({
      next: (data) => {
        this.estoques = data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  // --- Lógica para o Diálogo de Adicionar Itens ---

  inicializarFormAdicionarItens(): void {
    this.formAdicionarItens = this.fb.group({
      itens: this.fb.array([]),
    });
  }

  get itensArray(): FormArray {
    return this.formAdicionarItens.get('itens') as FormArray;
  }

  novoItem(): FormGroup {
    return this.fb.group({
      descricao: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      tipoItem: ['Nao Duravel', Validators.required],
      validade: [''],
      valor: [0],
    });
  }

  adicionarItemAoForm(): void {
    this.itensArray.push(this.novoItem());
  }

  removerItemDoForm(index: number): void {
    this.itensArray.removeAt(index);
  }

  abrirDialogoAdicionarItens(estoque?: EstoqueDTO): void {
    if (estoque) this.estoqueSelecionado = estoque;
    this.itensArray.clear();
    this.adicionarItemAoForm();
    this.mostrarDialogoAdicionarItens = true;
  }

  fecharDialogoAdicionarItens(): void {
    this.mostrarDialogoAdicionarItens = false;
  }

  salvarNovosItens(): void {
    if (this.formAdicionarItens.invalid || !this.estoqueSelecionado) {
      alert('Por favor, preencha todos os campos dos itens.');
      return;
    }

    const request: { idEstoque: number; itens: ItemRequest[] } = {
      idEstoque: this.estoqueSelecionado.id,
      itens: this.formAdicionarItens.value.itens,
    };

    this.estoqueService.adicionarItens(request).subscribe({
      next: () => {
        alert('Itens adicionados com sucesso!');
        this.fecharDialogoAdicionarItens();
        this.carregarEstoques();
      },
      error: (err) => {
        alert('Erro ao adicionar itens.');
        console.error(err);
      },
    });
  }

  calcularOcupacao(estoque: EstoqueDTO): number {
    if (!estoque.limite || estoque.limite === 0) return 0;
    return (estoque.quantidade / estoque.limite) * 100;
  }
}
