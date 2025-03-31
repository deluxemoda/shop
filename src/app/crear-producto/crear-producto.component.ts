import { Component, OnInit } from '@angular/core';
import { SbProductoService } from '../../servicios/SbProductoService';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  idtalla: number;
  idcategoria: number;
  idtipo: number;
  estado: string;
  precio: number;
  descuento: number;
  idcolor: number;
  cantidad: number;
  urlimagen1: string;
  urlimagen2: string;
}

interface Talla {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Tipo {
  id: number;
  nombre: string;
  foto: string;
}

interface Color {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  // Variable para identificar si se está editando
  productoId: number | null = null;

  // Arrays para los combos
  tallas: Talla[] = [];
  categorias: Categoria[] = [];
  tipos: Tipo[] = [];
  colores: Color[] = [];

  // Modelo para el nuevo producto (o para editar)
  nuevoProducto: Producto = {
    nombre: '',
    descripcion: '',
    idtalla: 0,
    idcategoria: 0,
    idtipo: 0,
    estado: '',
    precio: 0,
    descuento: 0,
    idcolor: 0,
    cantidad: 0,
    urlimagen1: '',
    urlimagen2: ''
  };

  notificationMessage: string = '';

  constructor(
    private sbProductoService: SbProductoService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Revisar si se pasó un parámetro "id" (modo edición)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productoId = +idParam;
      console.log('Editando producto con ID:', this.productoId);
      // Llama al método para cargar el producto por ID y rellenar el formulario
      await this.loadProducto(this.productoId);
    } else {
      console.log('Creando un nuevo producto');
    }

    // Cargar datos para los combos
    await Promise.all([
      this.loadTallas(),
      this.loadCategorias(),
      this.loadTipos(),
      this.loadColores()
    ]);
  }

  async loadProducto(id: number): Promise<void> {
    try {
      const producto = await this.sbProductoService.getProductoById(id);
      if (producto) {
        this.nuevoProducto = producto;
        console.log('Producto cargado para edición:', producto);
      } else {
        console.error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
    }
  }

  async loadTallas(): Promise<void> {
    this.tallas = await this.sbProductoService.getTallas();
  }

  async loadCategorias(): Promise<void> {
    this.categorias = await this.sbProductoService.getCategorias();
  }

  async loadTipos(): Promise<void> {
    this.tipos = await this.sbProductoService.getTipos();
  }

  async loadColores(): Promise<void> {
    this.colores = await this.sbProductoService.getColores();
  }

  // Método que guarda o actualiza el producto según el modo (crear o editar)
  async guardarProducto(): Promise<void> {
    console.log("Botón presionado - Enviando producto", this.nuevoProducto);

    // Si existe productoId, actualizamos; de lo contrario, creamos
    if (this.productoId) {
      // Actualización
      const response = await this.sbProductoService.updateProducto({ ...this.nuevoProducto, id: this.productoId });
      console.log('Respuesta de actualización:', response);
      if (response.success ) {
        this.notificationMessage = '✅ Producto actualizado exitosamente';
        // Opcional: reiniciar formulario y limpiar modo edición
        this.resetForm();
        this.productoId = null;
        // Mostrar la notificación
    setTimeout(() => {
      // Ocultar la notificación después de 3 segundos
      this.notificationMessage = '';

      // Redirigir al componente 'listar-productos'
      this.router.navigate(['/listarproducto']);
    }, 1000);
      } else {
        this.notificationMessage = '❌ Error al actualizar el producto';
      }
    } else {
      // Creación
      const data = await this.sbProductoService.createProducto(this.nuevoProducto);
      console.log('Respuesta del servicio:', data);
      // Según la lógica anterior, si data es null se considera éxito
      if (data.success) {
        this.notificationMessage = '✅ Producto creado exitosamente';
      
         this.productoId = null;
         // Mostrar la notificación
     setTimeout(() => {
       // Ocultar la notificación después de 3 segundos
       this.notificationMessage = '';
 
     }, 1000);
      } else {
        this.notificationMessage = '❌ Error al crear el producto';
      }
    }

    // Forzar la actualización de la vista y ocultar el mensaje después de 3 segundos
    this.cdr.detectChanges();
    setTimeout(() => {
      this.notificationMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  resetForm(): void {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      idtalla: 0,
      idcategoria: 0,
      idtipo: 0,
      estado: '',
      precio: 0,
      descuento: 0,
      idcolor: 0,
      cantidad: 0,
      urlimagen1: '',
      urlimagen2: ''
    };
  }
}
