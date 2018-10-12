import { Component, OnInit } from '@angular/core';
import { CursosService } from '../../service/cursos.service';
import { Curso } from '../../model/curso';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-cursos-lista',
	templateUrl: './cursos-lista.component.html',
	styleUrls: ['./cursos-lista.component.scss']
})
export class CursosListaComponent implements OnInit {

	// cursos: Curso[];
	cursos$: Observable<Curso[]>;

	constructor(private service: CursosService) {
	}

	ngOnInit() {
		// this.service.list()
		// 	.subscribe(dados => this.cursos = dados);

		this.cursos$ = this.service.list();
	}

}
