import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VerificaEmailService {

  constructor(private http: HttpClient) { }

  verificaEmail(email: string) {
    return this.http.get('assets/dados/veririfcarEmail.json')
        .pipe(
            delay(2000), //requisição depois de um delay de 2000. Bom para quando esta digitando em uma input
            // map((dados: any) => dados.email)
            map((dados: {emails: any[]}) => dados.emails),
            // tap(console.log),
            map((dados: {email: string}[]) => dados.filter(v => v.email === email)),
            // tap(console.log),
            map((dados: any[]) => dados.length > 0 ),
            // tap(console.log),
        );
  }
}
