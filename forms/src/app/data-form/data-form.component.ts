import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { EstadoBr } from './../shared/models/estado-br.model';
import { DropdownService } from './../shared/services/dropdown.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormValidations } from '../shared/form.validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { Cidade } from '../shared/models/cidade.model';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {
  estados: EstadoBr[];
  cidades: Cidade[];
  cargos: any[];
  tecnologias: any[];
  newsletterOptions: any[];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService,
  ) {
    super();
  }

  ngOnInit() {
    // this.verificaEmailService.verificaEmail('email@email.com').subscribe();
    this.dropdownService.getEstadosBr().subscribe(dados => this.estados = dados);
    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOptions = this.dropdownService.getNewsletter();
    console.log('this.tecnologias: ', this.tecnologias);

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      // email: [null, [Validators.required, Validators.email], [FormValidations.XPTO(this.validarEmail)] ], // pode criar uma validação para não precisar de usar o bind
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]], // validação assíncrona é o 3o parâmetro
      confirmarEmail: [null, FormValidations.equalsTo('email')],

      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'], // valor padrao s (Sim)
      termos: [null, Validators.pattern('true')], // se o campo for true, é valido
      frameworks: this.buildFrameworks(),
    });

    // this.formulario.get('endereco.cep').statusChanges
    // .pipe(
    //     distinctUntilChanged(),
    //     tap(value => console.log('valor CEp: ', value))
    // )
    // .subscribe(status => {
    //   if (status === 'VALID') {
    //     this.cepService.consultaCEP(this.formulario.get('endereco.cep').value, this.resetaDadosForm, this.formulario)
    //         .subscribe(dados => this.populaDadosForm(dados));
    //   }
    // });

    this.formulario.get('endereco.cep')
      .statusChanges // retorna o campo como 'INVALID' ou 'VALID' depois de passar por todas as validações
      // .pipe(
      //     distinctUntilChanged(), // retorna somente quando o valor mudar ( ex: não retorna 'INVALID' 2 vezes )
      //     tap(value => console.log('valor CEp: ', value)),
      //     switchMap(status => status === 'VALID' ?
      //         this.cepService.consultaCEP(this.formulario.get('endereco.cep').value)
      //         : empty()
      //       )
      //     )
      //     .subscribe(dados => dados ? this.populaDadosForm(dados) : {} );
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log('status CEP:', value)),
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCEP(this.formulario.get('endereco.cep').value)
          : new Observable()
        )
      )
      .subscribe(dados => dados ? this.populaDadosForm(dados) : {});

    this.formulario.get('endereco.estado').valueChanges
      .pipe(
        tap(estado => console.log('estado: ', estado)),
        map(estado => this.estados.filter(e => e.sigla === estado)),
        map(estados => estados && estados.length > 0 ? estados[0].id : new Observable()),
        switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)),
        tap(console.log)
      )
      .subscribe(cidades => this.cidades = cidades);

    // this.dropdownService.getCidades(8).subscribe(console.log);
  }

  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));
  }

  submit() {
    console.log(this.formulario);

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => v ? this.frameworks[i] : null)
        .filter(v => v !== null)
    });

    console.log('valueSubmit: ', valueSubmit);

    this.http
      .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe(
        dados => {
          console.log(dados);
          // reseta o form
          // this.formulario.reset();
          // this.resetar();
        },
        (error: any) => alert('erro')
      );
  }

  consultaCEP() {
    const cep = this.formulario.get('endereco.cep').value;
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep, this.resetaDadosForm, this.formulario)
        .subscribe(dados => this.populaDadosForm(dados));
    }
  }

  populaDadosForm(dados) {
    // this.formulario.setValue({});

    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });

    this.formulario.get('nome').setValue('Loiane');

    // console.log(form);
  }

  resetaDadosForm(formulario) {
    formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo').setValue(cargo);
  }

  setarTecnologias() {
    this.formulario.get('tecnologias').setValue(['java', 'javascript', 'php']);
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 && obj2;
  }

  // validação assíncrona
  validarEmail(formControl: FormControl) {
    return this.verificaEmailService.verificaEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? { emailInvalido: true } : null));
  }
}
