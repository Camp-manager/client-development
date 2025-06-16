import { AuthService } from './../../../../../user/src/app/components/login/shared/service/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { InscricaoService } from './shared/service/inscricao.service';
import { HttpErrorResponse } from '@angular/common/http';

import { Acampamento } from '../../shared/model/acampamento';
import { SafeUrl } from '@angular/platform-browser';
import { AcampamentoService } from '../../shared/services/acampamento.service';
import { CamisetaService } from '../../shared/services/camiseta.service';
import { environment } from '../../../../../.enviroment';
import { PessoaService } from './shared/service/pessoa.service';
import {
  MedicamentoDTO,
  MedicamentoService,
} from './shared/service/medicamento.service';
import { ViaCepService } from './shared/service/via-cep.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  standalone: false,
})
export class FormularioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inscricaoService = inject(InscricaoService);
  private acampamentoService = inject(AcampamentoService);
  private camisetaService = inject(CamisetaService);
  private authService = inject(AuthService);
  private pessoaService = inject(PessoaService);
  private medicamentoService = inject(MedicamentoService);
  private viaCepService = inject(ViaCepService);
  parentescosDisponiveis: string[] = [];
  medicamentosDisponiveis: MedicamentoDTO[] = [];

  formState: 'loading' | 'lookup' | 'filling' | 'error' = 'loading';
  acampamento: Acampamento | null = null;
  form!: FormGroup;
  tipoFormulario: 'campista' | 'funcionario' | null = null;
  cpfLookupControl = new FormControl('', [
    Validators.required,
    Validators.minLength(14),
  ]);
  isSubmitting = false;
  errorMessage: string | null = null;
  tamanhosCamisa: string[] = [];

  private codigoRegistro: string | null = null;
  private idAcampamento: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const tipo = params.get('tipo');
      this.idAcampamento = params.get('idAcampamento');
      this.codigoRegistro = params.get('codigoRegistro');

      if (!this.codigoRegistro || !tipo) {
        this.formState = 'error';
        this.errorMessage =
          'URL de inscrição inválida. Verifique o link recebido.';
        return;
      }

      if (tipo.toLowerCase() === 'cam') {
        this.tipoFormulario = 'campista';
        this.pessoaService
          .getParentesco()
          .subscribe((success) => (this.parentescosDisponiveis = success));
        this.medicamentoService.getTodosMedicamentos().subscribe((success) => {
          this.medicamentosDisponiveis = success;
        });
      } else if (tipo.toLowerCase() === 'fun') {
        this.tipoFormulario = 'funcionario';
      } else {
        this.formState = 'error';
        this.errorMessage = `Tipo de inscrição "${tipo}" é desconhecido.`;
        return;
      }

      this.buildForm();
      this.addCepListeners();
      this.carregarDadosIniciais(this.idAcampamento);
      this.formState = 'lookup';
    });
  }

  carregarDadosIniciais(idAcampamento: any): void {
    this.formState = 'loading';

    forkJoin({
      acampamento:
        this.acampamentoService.buscarAcampamentoBasico(idAcampamento),
      tamanhos: this.camisetaService.getTamanhos(),
    }).subscribe({
      next: ({ acampamento, tamanhos }) => {
        this.acampamento = acampamento;
        this.tamanhosCamisa = tamanhos;
        this.formState = 'lookup';
      },
      error: (err) => {
        this.formState = 'error';
        this.errorMessage =
          'Não foi possível carregar os dados do acampamento.';
      },
    });
  }

  buildForm(): void {
    if (this.tipoFormulario === 'campista') {
      this.form = this.fb.group({
        usaMedicamento: [false, Validators.required],
        idsDeMedicamentos: [[]],
        temAlergia: [false, Validators.required],
        alergias: [''],
        jaFezAcampamento: [false, Validators.required],
        acampamentosFeitos: [''],
        temBarraca: [false, Validators.required],
        tamanhoCamisa: [''],
        pessoa: this.fb.group({
          nomeCompleto: ['', Validators.required],
          cpf: ['', Validators.required],
          dataNascimento: ['', Validators.required],
          telefone: ['', Validators.required],
          sexo: ['', Validators.required],
          peso: [null, [Validators.required, Validators.min(1)]],
          altura: [null, [Validators.required, Validators.min(0.5)]],
          alimentoPredileto: [''],
          foiBatizado: [false, Validators.required],
          temPrimeiraComunhao: [false, Validators.required],
          endereco: this.fb.group({
            cep: ['', Validators.required],
            rua: ['', Validators.required],
            numero: ['', Validators.required],
            bairro: ['', Validators.required],
            cidade: ['', Validators.required],
            pontoReferencia: [''],
          }),
          familiar: this.fb.group({
            nome: ['', Validators.required],
            parentesco: ['', Validators.required],
            telefone: ['', Validators.required],
            endereco: this.fb.group({
              cep: ['', Validators.required],
              rua: ['', Validators.required],
              numero: ['', Validators.required],
              bairro: ['', Validators.required],
              cidade: ['', Validators.required],
              pontoReferencia: [''],
            }),
          }),
        }),
      });
    } else if (this.tipoFormulario === 'funcionario') {
      this.form = this.fb.group({
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        cpf: ['', Validators.required],
        telefone: ['', Validators.required],
        habilidade: ['', Validators.required],
        tamanhoCamisa: [''],
      });
    }
  }

  private addCepListeners(): void {
    this.form
      .get('pessoa.endereco.cep')
      ?.valueChanges.subscribe((cep: string) => {
        if (cep && cep.replace(/\D/g, '').length === 8) {
          this.buscarEndereco(cep, 'pessoa.endereco');
        }
      });

    this.form
      .get('pessoa.familiar.endereco.cep')
      ?.valueChanges.subscribe((cep: string) => {
        if (cep && cep.replace(/\D/g, '').length === 8) {
          this.buscarEndereco(cep, 'pessoa.familiar.endereco');
        }
      });
  }
  buscarEndereco(cep: string, formGroupPath: string): void {
    const addressFormGroup = this.form.get(formGroupPath) as FormGroup;
    // Clear previous address fields before fetching
    addressFormGroup.patchValue({
      rua: '',
      bairro: '',
      cidade: '',
      pontoReferencia: '',
    });

    this.viaCepService.buscarEnderecoPorCep(cep).subscribe({
      next: (data) => {
        if (!data.erro) {
          addressFormGroup.patchValue({
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
          });
        }
      },
      error: (err) => {},
    });
  }

  buscarDadosPorCPF(): void {
    if (this.cpfLookupControl.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;
    const cpf = this.cpfLookupControl.value!;

    this.inscricaoService
      .getDadosPessoaPorCPF(cpf, this.idAcampamento!)
      .subscribe({
        next: (dados: any) => {
          if (this.tipoFormulario === 'campista') {
            const dadosMapeados = {
              nomeCompleto: dados.nome,
              cpf: cpf,
              telefone: dados.telefone,
              ...dados,
            };

            this.form.get('pessoa')?.patchValue(dadosMapeados);
          } else if (this.tipoFormulario === 'funcionario') {
            const dadosFuncionario = {
              nome: dados.nome,
              email: dados.email,
              cpf: cpf,
              telefone: dados.telefone,
              habilidade: dados.habilidade || '',
            };
            this.form.patchValue(dadosFuncionario);
          }
          alert(
            'Dados carregados com sucesso! Por favor, revise as informações.'
          );
          this.formState = 'filling';
          this.isSubmitting = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            alert(
              'CPF não encontrado. Por favor, preencha o formulário pela primeira vez.'
            );
            const cpfControlPath =
              this.tipoFormulario === 'campista' ? 'pessoa.cpf' : 'cpf';
            this.form.get(cpfControlPath)?.setValue(cpf);
            this.formState = 'filling';
          } else {
            this.errorMessage =
              'Ocorreu um erro ao buscar seus dados. Tente novamente.';
          }
          this.isSubmitting = false;
        },
      });
  }

  pularBuscaCPF(): void {
    this.formState = 'filling';
  }

  copiarEndereco(event: any): void {
    const enderecoCampista = this.form.get('pessoa.endereco')?.value;
    const enderecoFamiliar = this.form.get('pessoa.familiar.endereco');

    if (event.target.checked && enderecoCampista) {
      enderecoFamiliar?.patchValue(enderecoCampista);
    } else {
      enderecoFamiliar?.reset();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios em destaque.');
      return;
    }

    this.isSubmitting = true;
    const payload = this.form.value;
    let submitRequest$: Observable<void>;

    if (this.tipoFormulario === 'campista') {
      payload.alergias = payload.alergias
        ? payload.alergias.split(',').map((s: string) => s.trim())
        : [];
      payload.acampamentosFeitos = payload.acampamentosFeitos
        ? payload.acampamentosFeitos.split(',').map((s: string) => s.trim())
        : [];
      submitRequest$ = this.inscricaoService.cadastrarCampista(
        this.codigoRegistro!,
        payload
      );
    } else {
      submitRequest$ = this.inscricaoService.cadastrarFuncionario(
        this.codigoRegistro!,
        payload
      );
    }

    submitRequest$.subscribe({
      next: () => {
        this.isSubmitting = false;
        if (this.tipoFormulario === 'funcionario')
          this.authService
            .login({
              login: payload.email,
              password: payload.cpf.substring(0, 3),
            })
            .subscribe((success) => {
              localStorage.setItem('token', success.token);
            });
        this.openDialog();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = `Erro ao enviar inscrição: ${err.message}`;
      },
    });
  }

  mostrarDialogoQRCode: boolean = false;
  qrCodeData?: string;
  qrCodeImageURL: SafeUrl | null = null;

  openDialog() {
    this.mostrarDialogoQRCode = true;
    this.qrCodeData = `${environment.CLIENT}/formulario/cam/${this.idAcampamento}/${this.codigoRegistro}`;
  }

  fecharDialogoQRCode() {
    this.mostrarDialogoQRCode = false;
    this.qrCodeImageURL = null;
    this.router.navigate(['/nossa-historia']);
  }

  onQRCodeURL(url: SafeUrl): void {
    this.qrCodeImageURL = url;
  }

  downloadQRCode(): void {
    if (!this.qrCodeImageURL || !this.acampamento) return;

    const link = document.createElement('a');
    link.href = this.qrCodeImageURL.toString();
    link.download = `qrcode-${this.acampamento.nomeAcampamento}.png`;
    link.click();
  }
}
