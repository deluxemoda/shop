import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [CommonModule, RouterModule], // Agrega RouterModule aquí
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent { cerrarMenu() {
  // Se asume que el checkbox tiene el id "menu-toggle"
  const menuToggle = document.getElementById('menu-toggle') as HTMLInputElement;
  if (menuToggle) {
    menuToggle.checked = false;
  }
}}