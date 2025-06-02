import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {

  pagina: number = 1;
  termos: boolean = false;
  listaMedicacao: any[];
  listaAlergias: any[];
  listaAcampamentos: any[];

  formularioPagina1!: FormGroup;
  formularioPagina2!: FormGroup;
  formularioPagina3!: FormGroup;
  formularioCompleto!: FormGroup;
  forms: FormGroup[] = [];


  constructor(private router: Router, private fb: FormBuilder) {
    this.listaMedicacao = [{ descricao: 'Paracetamol' }, { descricao: 'Ibuprofeno' }];
    this.listaAlergias = [{ descricao: 'Dipirona' }, { descricao: 'Amoxicilina' }];
    this.listaAcampamentos = [{ nome: 'Escoteiro' }, { nome: 'Aventura Jovem' }];


    this.formularioPagina1 = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ú\s]+$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/)]],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      idade: [''],
      peso: ['', [Validators.required, Validators.pattern(/^\d{1,3}([.,]\d{1,2})?$/)]],
      altura: ['', [Validators.required, Validators.pattern(/^\d{1,3}([.,]\d{1,2})?$/)]],
      enderecoParticular: ['', Validators.required],
      cidade: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ú\s]+$/)]],
      pontoDeReferencia: [''],
    });

    this.formularioPagina2 = this.fb.group({
      telefoneFamiliar: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/)]],
      enderecoFamiliar: ['', Validators.required],
      cidadeFamiliar: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ú\s]+$/)]],
      pontoDeReferenciaFamiliar: [''],
    });

    this.formularioPagina3 = this.fb.group({
      medicacoes: [[]],
      alergias: [[]],
      acampamentos: [[]],
      temBarraca: [false],
      tamanhoCamisa: [null]
    });

  }

  ngOnInit(): void {
    const code = this.router.getCurrentNavigation()?.extras.state?.['code'];
    console.log(code);
  }

  calcularIdade(): void {
    let data = this.formularioPagina1.get('dataNascimento')?.value;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = data.match(regex);
    if (!match) return;

    const [_, diaStr, mesStr, anoStr] = match;
    const dia = +diaStr;
    const mes = +mesStr;
    const ano = +anoStr;

    const nascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    if (
      hoje.getMonth() < nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    this.formularioPagina1.get('idade')?.setValue(idade);
  }

  nextPage(): void {
    this.forms = [this.formularioPagina1, this.formularioPagina2];
    if (this.pagina < 3 && this.forms[this.pagina - 1].valid) {
      this.pagina++;
    } else if (this.pagina === 3 && this.formularioPagina3.valid) {
      console.log(this.pagina)
      this.juntarFormularios();
    } else {
      this.forms[this.pagina - 1].markAllAsTouched();
    }
  }

  juntarFormularios(): void {
    if(this.termos) {
      this.formularioCompleto = this.fb.group({
        ...this.formularioPagina1.value,
        ...this.formularioPagina2.value,
        ...this.formularioPagina3.value,
      });
      console.log('Formulário final:', this.formularioCompleto.value);
    }
  }


  goBack() {
    this.pagina = this.pagina - 1;
    if (this.pagina < 1) {
      this.router.navigate(['/']);
    }
  }

}
