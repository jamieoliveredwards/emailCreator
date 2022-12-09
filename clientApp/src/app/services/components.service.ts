import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_BASE } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {

  constructor(
    @Inject(API_BASE) public apiBase: string,
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<string[]>(`${this.apiBase}/components`);
  }

  create(image: File) {
    const formData = new FormData();
    formData.set('image', image);
    return this.http.post<{ result: string }>(`${this.apiBase}/components`, formData);
  }

}
