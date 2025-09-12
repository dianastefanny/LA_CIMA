import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Variables de formulario
  usuarioLogin: string = '';
  contrasenaLogin: string = '';
  nombreCompleto: string = '';
  usuarioRegistro: string = '';
  contrasenaRegistro: string = '';

  private apiUrl = 'http://localhost:3000/auth'; // 👈 URL del backend

  constructor(private authService: AuthService, private router: Router) {}

  // ==========================
  // Iniciar sesión
  // ==========================
  onLogin() {
    this.authService.login(this.usuarioLogin, this.contrasenaLogin)
      .subscribe({
        next: (data: any) => {
          if (data.success && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', data.usuario.nombre);
            alert('Inicio de sesión exitoso ✅');
            this.router.navigate(['/bienvenida']);
          } else {
            alert(data.message || 'Usuario o contraseña incorrectos.');
          }
        },
        error: (err: any) => {
          console.error('Error al iniciar sesión:', err);
          alert('Ocurrió un error en el inicio de sesión.');
        }
      });
  }

  // ==========================
  // Registrar usuario
  // ==========================
  onRegister() {
    this.authService.register(this.nombreCompleto, this.usuarioRegistro, this.contrasenaRegistro)
      .subscribe({
        next: (data: any) => {
          if (data.success && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', data.usuario.nombre);
            alert('Registro exitoso 🎉');
            this.router.navigate(['/bienvenida']);
          } else {
            alert(data.message || 'No se pudo registrar.');
          }
        },
        error: (err: any) => {
          console.error('Error al registrar:', err);
          alert('Ocurrió un error al registrar.');
        }
      });
  }

  // ==========================
  // Cerrar sesión
  // ==========================
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}