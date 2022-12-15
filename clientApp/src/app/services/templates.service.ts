import { HttpClient } from '@angular/common/http';
import { TemplateLiteral } from '@angular/compiler';
import { Inject, Injectable } from '@angular/core';
import { shareReplay, tap } from 'rxjs';
import { API_BASE } from '../app.module';

export interface Template {
  name: string;
  components: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  constructor(
    @Inject(API_BASE) public apiBase: string,
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<Template[]>(`${this.apiBase}/templates`);
  }

  create(template: Template) {
    return this.http.post<{ result: string }>(`${this.apiBase}/templates`, template);
  }

  delete(templateName: string) {
    const name = templateName.replace(' ', '_');
    return this.http.delete<{ result: string }>(`${this.apiBase}/templates/${name}`).pipe(
      tap(val => console.log(val))
    )
  }
}
