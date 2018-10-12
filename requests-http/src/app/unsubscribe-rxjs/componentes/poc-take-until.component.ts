import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnviarValorService } from '../enviar-valor.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-poc-take-until',
	template: `
		<app-poc-base [nome]="nome"
					  [valor]="valor" estilo="bg-primary">
		</app-poc-base>
    `
})
export class PocTakeUntilComponent implements OnInit, OnDestroy {

	nome = 'Componente com takeUntil';
	valor: string;

	unsub$ = new Subject();

	constructor(private service: EnviarValorService) {
	}

	ngOnInit() {
		this.service.getValor()
			.pipe(
				tap(v => console.log(this.nome, v)),
				takeUntil(this.unsub$) // <- takeUntil: se desescreve após receber um valor automaticamente
			)
			.subscribe(novoValor => this.valor = novoValor);
	}

	ngOnDestroy() {
		this.unsub$.next(); // emite o valor
		this.unsub$.complete(); // completa e finaliza para não acontecer memory leak
		console.log(`${this.nome} foi destruido`);
	}
}
