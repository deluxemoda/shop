import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-zapatos',
  standalone: true,imports: [NgbCarouselModule, RouterModule,CommonModule ],
  templateUrl: './zapatos.component.html',
  styleUrls: ['./zapatos.component.css']
})
export class ZapatosComponent implements AfterViewInit, OnDestroy {
  private readonly TIMEOUT: number = 6000;
  private intervalId: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Inicia el intervalo para el slider
    this.startInterval();

    // Selecciona el contenedor del slider y asigna los eventos de hover para detener/reiniciar el auto-play
    const sliderWrapper = this.el.nativeElement.querySelector('.css-slider-wrapper');
    if (sliderWrapper) {
      this.renderer.listen(sliderWrapper, 'mouseenter', () => this.stopInterval());
      this.renderer.listen(sliderWrapper, 'mouseleave', () => this.startInterval());
    }
  }

  ngOnDestroy(): void {
    this.stopInterval();
  }

  private handleNext(): void {
    // Selecciona todos los inputs que tengan en su clase la cadena "slide-radio"
    const radios: NodeListOf<HTMLInputElement> = this.el.nativeElement.querySelectorAll('input[class*="slide-radio"]');
    if (!radios || radios.length === 0) {
      return;
    }
    // Selecciona el radio actualmente marcado
    const activeRadio: HTMLInputElement | null = this.el.nativeElement.querySelector('input[class*="slide-radio"]:checked');
    const radiosArray = Array.from(radios);
    const currentIndex = activeRadio ? radiosArray.indexOf(activeRadio) : -1;

    // Desmarca todos los radios
    radiosArray.forEach(radio => radio.checked = false);

    // Si el radio activo es el último, activa el primero; de lo contrario, el siguiente.
    if (currentIndex >= radiosArray.length - 1) {
      radiosArray[0].click();
    } else if (currentIndex !== -1) {
      radiosArray[currentIndex + 1].click();
    }
  }

  private startInterval(): void {
    this.intervalId = setInterval(() => this.handleNext(), this.TIMEOUT);
  }

  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
