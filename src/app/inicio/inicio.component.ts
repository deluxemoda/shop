import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgbCarouselModule,RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Si requieres inicializaciones, puedes colocarlas aquí.
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const wScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

    // Actualiza la transformación del logo
    const logo = document.querySelector('.logo') as HTMLElement;
    if (logo) {
      logo.style.transform = `translate(0px, ${wScroll / 2}%)`;
    }

    // Actualiza la transformación del pájaro de fondo
    const backBird = document.querySelector('.back-bird') as HTMLElement;
    if (backBird) {
      backBird.style.transform = `translate(${wScroll / 30}%, ${wScroll / 4}%)`;
    }

    // Actualiza la transformación del pájaro de adelante
    const foreBird = document.querySelector('.fore-bird') as HTMLElement;
    if (foreBird) {
      foreBird.style.transform = `translate(0px, -${wScroll / 40}%)`;
    }

    // Animación de las imágenes de ropa
    const clothesPics = document.querySelector('.clothes-pics') as HTMLElement;
    if (clothesPics) {
      const clothesPicsOffset = clothesPics.getBoundingClientRect().top + window.pageYOffset;
      if (wScroll > clothesPicsOffset - (window.innerHeight / 1.2)) {
        const figures = document.querySelectorAll('.clothes-pics figure');
        figures.forEach((figure, i) => {
          setTimeout(() => {
            figure.classList.add('is-showing');
          }, 150 * (i + 1));
        });
      }
    }

    // Ajuste del background y opacidad en la "large-window"
    const largeWindow = document.querySelector('.large-window') as HTMLElement;
    if (largeWindow) {
      const largeWindowOffset = largeWindow.getBoundingClientRect().top + window.pageYOffset;
      if (wScroll > largeWindowOffset - window.innerHeight) {
        // Actualiza la posición del background
        largeWindow.style.backgroundPosition = `center, 0px ${wScroll - largeWindowOffset}px`;

        // Calcula la opacidad para el tinte
        const opacity = (wScroll - largeWindowOffset + 400) / (wScroll / 5);
        const windowTint = document.querySelector('.window-tint') as HTMLElement;
        if (windowTint) {
          windowTint.style.opacity = opacity.toString();
        }
      }
    }

    // Animación para los blog posts
    const blogPosts = document.querySelector('.blog-posts') as HTMLElement;
    if (blogPosts) {
      const blogPostsOffset = blogPosts.getBoundingClientRect().top + window.pageYOffset;
      if (wScroll > blogPostsOffset - window.innerHeight) {
        const offset = Math.min(0, wScroll - blogPostsOffset + window.innerHeight - 350);
        const post1 = document.querySelector('.post-1') as HTMLElement;
        if (post1) {
          post1.style.transform = `translate(${offset}px, ${Math.abs(offset * 0.2)}px)`;
        }
        const post3 = document.querySelector('.post-3') as HTMLElement;
        if (post3) {
          post3.style.transform = `translate(${Math.abs(offset)}px, ${Math.abs(offset * 0.2)}px)`;
        }
      }
    }
  }
}
