import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class EnviarValorService {

	private emissor$ = new Subject<string>(); // emissor

	emitirValor(valor: string) {
		this.emissor$.next(valor); // emite novo valor
	}

	getValor() {
		return this.emissor$.asObservable(); // retorna o subject como observable
	}

}
