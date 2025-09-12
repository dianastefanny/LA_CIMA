import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {
  usuario: string | null = '';
  mensaje: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    const nuevoUsuario = localStorage.getItem('nuevoUsuario');

    if (!token || !usuario) {
      this.router.navigate(['/']);
    } else {
      this.usuario = usuario;
      if (nuevoUsuario === 'true') {
        this.mensaje = `Bienvenido(a) ${this.usuario}, ahora haces parte de nuestros clientes de la constructora 🏡`;
      } else {
        this.mensaje = `Un gusto tenerte de nuevo con nosotros, ${this.usuario} 😊`;
      }
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('nuevoUsuario');
    this.router.navigate(['/']);
  }

  contestarEncuesta() {
    // 🔜 Aquí después enlazamos la ruta de tu encuesta
    alert('Función de encuesta aún no implementada');
  }
}