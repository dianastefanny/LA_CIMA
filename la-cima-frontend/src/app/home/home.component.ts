import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  modalContenido: string = '';
  modalVisible: boolean = false;

  mostrarModal(tipo: string) {
    this.modalContenido = tipo;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  verMas(event: Event) {
    const boton = event.currentTarget as HTMLElement;
    const servicio = boton.closest('.servicio');
    if (!servicio) return;

    const caja = servicio.querySelector('.descripcion-larga');
    if (!caja) return;

    caja.classList.toggle('show');
    boton.textContent = caja.classList.contains('show') ? 'Ver menos' : 'Ver más';
  }
}