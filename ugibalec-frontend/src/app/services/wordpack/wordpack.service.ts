import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WordpackDTO } from 'src/app/models/wordpack/wordpack.model';

@Injectable({
  providedIn: 'root',
})
export class WordpackService {
  private readonly hostname: string = 'http://localhost:3000';

  constructor(private readonly httpClient: HttpClient) {}

  public getWordpacks(): Observable<Array<WordpackDTO>> {
    return this.httpClient.get<Array<WordpackDTO>>(`${this.hostname}/wordpack`);
  }
}
