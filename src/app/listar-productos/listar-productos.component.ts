import { Component, OnInit } from '@angular/core';
import { SbProductoService } from '../../servicios/SbProductoService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tipo {
  id: number;
  nombre: string;
  foto: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Talla {
  id: number;
  nombre: string;
}

interface Color {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent implements OnInit {
  // Listas de productos y filtro
  productos: any[] = [];
  productosFiltrados: any[] = [];
  imagenSeleccionada: string | null = null;

  abrirImagen(url: string): void {
    this.imagenSeleccionada = url;
  }
  
  cerrarImagen(): void {
    this.imagenSeleccionada = null;
  }
  // Variables de búsqueda y filtro
  searchId: string = '';
  filtroTipo: string = '';
  filtroCategoria: string = '';
  filtroTalla: string = '';
  filtroColor: string = '';

  // Listas para llenar los combos de filtro
  tipos: Tipo[] = [];
  categorias: Categoria[] = [];
  tallas: Talla[] = [];
  colores: Color[] = [];

  constructor(private sbProductoService: SbProductoService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.loadProductos();
    await this.loadTipos();
    await this.loadCategorias();
    await this.loadTallas();
    await this.loadColores();
  }
  
  async loadProductos(): Promise<void> {
    this.productos = await this.sbProductoService.getProductos();
    this.filtrarProductos();
  }

  async loadTipos(): Promise<void> {
    const data = await this.sbProductoService.getTipos();
    this.tipos = data as Tipo[];
  }
  
  async loadCategorias(): Promise<void> {
    const data = await this.sbProductoService.getCategorias();
    this.categorias = data as Categoria[];
  }
  
  async loadTallas(): Promise<void> {
    const data = await this.sbProductoService.getTallas();
    this.tallas = data as Talla[];
  }
  
  async loadColores(): Promise<void> {
    const data = await this.sbProductoService.getColores();
    this.colores = data as Color[];
  }

  // Método para filtrar productos según los filtros y búsqueda
  filtrarProductos(): void {
    this.productosFiltrados = this.productos.filter(producto => {
      const matchId = !this.searchId || producto.id.toString().includes(this.searchId);
      const matchTipo = !this.filtroTipo || producto.idtipo.toString() === this.filtroTipo;
      const matchCategoria = !this.filtroCategoria || producto.idcategoria.toString() === this.filtroCategoria;
      const matchTalla = !this.filtroTalla || producto.idtalla === +this.filtroTalla;
      const matchColor = !this.filtroColor || producto.idcolor.toString() === this.filtroColor;
      return matchId && matchTipo && matchCategoria && matchTalla && matchColor;
    });
  }

  // Método para eliminar un producto
  async eliminarProducto(id: number): Promise<void> {
    const confirmar = confirm("¿Seguro que deseas eliminar este producto?");
    if (confirmar) {
      const result = await this.sbProductoService.eliminarProducto(id);
      if (result) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.filtrarProductos();
        alert('Producto eliminado con éxito');
      } else {
        alert('Error al eliminar el producto');
      }
    }
  }

  // Redirige al formulario para agregar producto
  agregarProducto(): void {
    this.router.navigate(['/crearproducto']);
  }

  // Redirige al formulario de edición del producto
  editarProducto(id: number): void {
    this.router.navigate(['/crearproducto', id]);
  }
}
