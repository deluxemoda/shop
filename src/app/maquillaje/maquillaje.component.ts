import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Si cuentas con el plugin DrawSVGPlugin, descomenta la siguiente línea:
// import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger /*, DrawSVGPlugin*/);

@Component({
  selector: 'app-maquillaje',
  standalone: true,
  templateUrl: './maquillaje.component.html',
  styleUrls: ['./styles.scss','./maquillaje.component.css']
})
export class MaquillajeComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    // Animación del trazo de la máscara
    gsap.from("#mask-stroke", {
      drawSVG: "0%", // requiere DrawSVGPlugin
      scrollTrigger: {
        trigger: "#page",
        start: "-7% top",
        end: "bottom+=20% bottom",
        scrub: 1
      }
    });

    // Animación del trazo
    gsap.from("#stroke", {
      "--dashOffset": 1000,
      delay: 1,
      scrollTrigger: {
        trigger: "#page",
        start: "-5% top",
        end: "bottom+=20% bottom",
        scrub: 1
      }
    });

    // Animación del texto de los elementos con clase .revealer-inner
    const textElements = gsap.utils.toArray(".revealer-inner");
    textElements.forEach((el: any, i: number) => {
      gsap.from(el, {
        yPercent: 120,
        duration: 1,
        delay: el.classList.contains("page-title-secondary") ? 2 : 1,
        scrollTrigger: {
          trigger: el,
          start: "top center",
          end: "bottom top",
          toggleActions: "restart pause resume reset"
        }
      });
    });

    // Animación de las imágenes con clase .revealer-img
    const imageElements = gsap.utils.toArray(".revealer-img");
    imageElements.forEach((el: any) => {
      gsap.from(el, {
        opacity: 0,
        yPercent: 10,
        scale: 1.2,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "restart pause resume pause"
        }
      });
    });

    // (Opcional) Código comentado con IntersectionObserver
    // const observer = new IntersectionObserver(([entry]) => {
    //   if (entry.isIntersecting) {
    //     entry.target.dataset.visible = 'true';
    //   } else {
    //     delete entry.target.dataset.visible;
    //   }
    // }, { root: null, threshold: 0 });
    //
    // document.querySelectorAll('.revealer').forEach(el => {
    //   observer.observe(el);
    // });
  }
}
