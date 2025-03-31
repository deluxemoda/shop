import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-joyeria',
  standalone: true,
  imports: [NgbCarouselModule, RouterModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './joyeria.component.html',
  styleUrls: ['./joyeria.component.css']
})
export class JoyeriaComponent {
  // Referencia al contenedor del slider usando una variable de plantilla "slider"
  @ViewChild('slider', { static: true }) slider!: ElementRef;

  constructor(private renderer: Renderer2) {}

  // Método que actúa según el botón clickeado
  activate(e: Event): void {
    const target = e.target as HTMLElement;
    const sliderEl = this.slider.nativeElement as HTMLElement;
    const items = sliderEl.querySelectorAll('.item');

    if (target.matches('.next')) {
      // Mueve el primer elemento al final
      this.renderer.appendChild(sliderEl, items[0]);
    } else if (target.matches('.prev')) {
      // Mueve el último elemento al inicio
      this.renderer.insertBefore(sliderEl, items[items.length - 1], items[0]);
    }
  }
}
