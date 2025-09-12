import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },          // Página principal
  { path: 'login', component: LoginComponent },    // Login
  { path: 'bienvenida', component: BienvenidaComponent }, // Bienvenida
  { path: '**', redirectTo: '' }                   // Cualquier ruta no encontrada → Home
];