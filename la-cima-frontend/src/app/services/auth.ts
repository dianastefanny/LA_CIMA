import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { usuario, contrasena });
  }

  register(nombre_completo: string, usuario: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, { nombre_completo, usuario, contrasena });
  }
}