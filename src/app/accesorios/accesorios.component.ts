import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accesorios',
  standalone: true,
  imports: [NgbCarouselModule, RouterModule,CommonModule],
  templateUrl: './accesorios.component.html',
  styleUrl: './accesorios.component.css'
})
export class AccesoriosComponent {
  isCollapsed = true;
}
