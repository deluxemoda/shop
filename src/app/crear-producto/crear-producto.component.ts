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
  idcategoria: number;
  idtipo: number;
  estado: string;
  precio: number;
  descuento: number;
  urlimagen1: string;
  urlimagen2: string;
  idcolor: number;
  codigo: number;
  seleccionado: boolean;
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

interface Talla {
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

  // Arrays para combos
  tallas: Talla[] = [];
  categorias: Categoria[] = [];
  tipos: Tipo[] = [];
  colores: Color[] = [];

  // Modelo para el producto
  nuevoProducto: Producto = {
    nombre: '',
    descripcion: '',
    idcategoria: 0,
    idtipo: 0,
    estado: '',
    precio: 0,
    descuento: 0,
    urlimagen1: '',
    urlimagen2: '',
    idcolor: 0,
    codigo: 0,
    seleccionado: false
  };

  // Lista de tallas agregadas para el producto (tabla intermedia)
  tallasProducto: { idtalla: number; cantidad: number }[] = [];

  // Objeto para el formulario de tallas
  nuevaTalla: { idtalla: number | null; cantidad: number | null } = {
    idtalla: null,
    cantidad: null
  };

  // Bandera para saber si estamos editando una talla
  editandoTalla: boolean = false;
  // Índice del elemento que se está editando
  indiceEditando: number | null = null;

  notificationMessage: string = '';

  constructor(
    private sbProductoService: SbProductoService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Revisar si se pasó un parámetro "id" (modo edición)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productoId = +idParam;
      console.log('Editando producto con ID:', this.productoId);
      await this.loadProducto(this.productoId);
      // Opcional: cargar las tallasProducto asociadas a este producto para edición
    } else {
      console.log('Creando un nuevo producto');
    }

    // Cargar datos para los combos
    await Promise.all([
      this.loadCategorias(),
      this.loadTipos(),
      this.loadColores(),
      this.loadTallas()  // Carga las tallas desde la tabla tallas
    ]);
  }
  async loadProducto(id: number): Promise<void> {
    try {
      const producto = await this.sbProductoService.getProductoById(id);
      if (producto) {
        this.nuevoProducto = producto;
        console.log('Producto cargado para edición:', producto);
        
        // Cargar las tallas asociadas a este producto
        await this.loadTallasProducto(id);
      } else {
        console.error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
    }
  }


// Nuevo método para obtener las tallas asociadas al producto
async loadTallasProducto(id: number): Promise<void> {
  try {
    this.tallasProducto = await this.sbProductoService.getTallasByProductoId(id) || [];
    console.log('Tallas cargadas:', this.tallasProducto);
  } catch (error) {
    console.error('Error al cargar las tallas del producto:', error);
  }
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

  async loadTallas(): Promise<void> {
    this.tallas = await this.sbProductoService.getTallas();
  }

  // Método para agregar o actualizar una talla en la lista
  agregarOActualizarTalla(): void {
    if (this.nuevaTalla.idtalla && this.nuevaTalla.cantidad !== null) {
      if (this.editandoTalla && this.indiceEditando !== null) {
        // Actualiza la entrada existente
        this.tallasProducto[this.indiceEditando] = {
          idtalla: this.nuevaTalla.idtalla,
          cantidad: this.nuevaTalla.cantidad
        };
        this.editandoTalla = false;
        this.indiceEditando = null;
      } else {
        // Agrega una nueva entrada
        // (Opcional: validar para evitar duplicados)
        this.tallasProducto.push({
          idtalla: this.nuevaTalla.idtalla,
          cantidad: this.nuevaTalla.cantidad
        });
      }
      // Reinicia el formulario de tallas
      this.nuevaTalla = { idtalla: null, cantidad: null };
    }
  }

  // Método para editar una talla existente
  editarTalla(item: { idtalla: number; cantidad: number }, indice: number): void {
    this.nuevaTalla = { ...item };
    this.editandoTalla = true;
    this.indiceEditando = indice;
  }

  // Método para cancelar la edición de una talla
  cancelarEdicion(): void {
    this.nuevaTalla = { idtalla: null, cantidad: null };
    this.editandoTalla = false;
    this.indiceEditando = null;
  }

  // Método para eliminar una talla de la lista
  eliminarTalla(indice: number): void {
    this.tallasProducto.splice(indice, 1);
  }

  // Devuelve el nombre de la talla dado su id (usando la lista cargada de tallas)
  obtenerNombreTalla(idtalla: number): string {
    const talla = this.tallas.find(t => t.id === idtalla);
    return talla ? talla.nombre : 'Desconocida';
  }

  // Método para guardar o actualizar el producto
  async guardarProducto(): Promise<void> {
    console.log("Botón presionado - Enviando producto", this.nuevoProducto);

    // Aquí, además de guardar la información del producto, deberás enviar
    // la lista de tallasProducto para crear/actualizar las filas en la tabla intermedia.
    // Por ejemplo, podrías hacer:
    // await this.sbProductoService.guardarTallasProducto(this.productoId, this.tallasProducto);

    if (this.productoId) {
      const response = await this.sbProductoService.updateProductoConTallas({ ...this.nuevoProducto, id: this.productoId, }, this.tallasProducto);
      console.log('Respuesta de actualización:', response);
      if (response.success) {
        this.notificationMessage = '✅ Producto actualizado exitosamente';
        this.resetForm();
        this.productoId = null;
        setTimeout(() => {
          this.notificationMessage = '';
          this.router.navigate(['/listarproducto']);
        }, 1000);
      } else {
        this.notificationMessage = '❌ Error al actualizar el producto';
      }
    } else {
      const data = await this.sbProductoService.createProductoConTallas(this.nuevoProducto,this.tallasProducto);
      console.log('Respuesta del servicio:', data);
      if (data.success) {
        this.notificationMessage = '✅ Producto creado exitosamente';
        // Luego, si es necesario, guarda las tallas asociadas usando el id del producto recién creado.
        setTimeout(() => {
          this.notificationMessage = '';
        }, 1000);
      } else {
        this.notificationMessage = '❌ Error al crear el producto';
      }
    }

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
      idcategoria: 0,
      idtipo: 0,
      estado: '',
      precio: 0,
      descuento: 0,
      urlimagen1: '',
      urlimagen2: '',
      idcolor: 0,
      codigo: 0,
      seleccionado: false
    };
    // Reinicia también la lista de tallas asociadas
    this.tallasProducto = [];
  }
}
