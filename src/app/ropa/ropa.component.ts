import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SbProductoService } from '../../servicios/SbProductoService'; 
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

interface Producto {
  id: number;
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
  selectedQuantity?: number;
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

interface CartItem {
  id: number;
  nombre: string;
  precio: number; // precio con descuento aplicado
  cantidad: number;
  stock: number;
  descuento: number;
}

@Component({
  selector: 'app-ropa',
  standalone: true,
  imports: [CommonModule,NgbCarouselModule],
  templateUrl: './ropa.component.html',
  styleUrls: ['./ropa.component.css']
})
export class RopaComponent implements OnInit {
  showImagePopup: boolean = false;
  selectedImage: string = ''; // Para almacenar la URL de la imagen seleccionada

  // Función para abrir el pop-up con la imagen seleccionada
  openImagePopup(imageUrl: string | undefined): void {
    // Usa un valor predeterminado en caso de que imageUrl sea undefined
    this.selectedImage = imageUrl || 'path/to/default-image.jpg';  // Imagen por defecto
    this.showImagePopup = true;
  }

  // Función para cerrar el pop-up
  closeImagePopup(): void {
    this.showImagePopup = false;
  }
  
  // Datos cargados desde Supabase
  productos: Producto[] = [];
  tallas: Talla[] = [];
  categorias: Categoria[] = [];
  tipos: Tipo[] = [];
  colores: Color[] = [];

  // Variables de UI
  showMenu: boolean = false;
  itemsPerPage: number = 12;
  currentPage: number = 1;
  totalPages: number = 0;

  // Filtros
  filtroTipo: number | null = null;
  filtroCategoria: number | null = null;
  filtroTalla: number | null = null;
  filtroColor: number | null = null;

  // Carrito de compras
  carrito: CartItem[] = [];

  // Notificación temporal
  notificationMessage: string = '';

  // Modal del producto y carrito
  showProductModal: boolean = false;
  selectedProduct: Producto | null = null;
  showCartModal: boolean = false;

  constructor(private sbProductoService: SbProductoService) {}

  async ngOnInit(): Promise<void> {
    // Carga de datos desde Supabase usando el servicio
    await Promise.all([
      this.loadProductos(),
      this.loadTallas(),
      this.loadCategorias(),
      this.loadTipos(),
      this.loadColores()
    ]);

    // Inicializa la cantidad seleccionada de cada producto
    this.productos.forEach(prod => prod.selectedQuantity = 1);
    this.updatePagination();
  }

  // Métodos para cargar datos desde el servicio
  async loadProductos(): Promise<void> {
    const data = await this.sbProductoService.getProductos();
    this.productos = data as Producto[];
  }

  async loadTallas(): Promise<void> {
    const data = await this.sbProductoService.getTallas();
    this.tallas = data as Talla[];
  }

  async loadCategorias(): Promise<void> {
    const data = await this.sbProductoService.getCategorias();
    this.categorias = data as Categoria[];
  }

  async loadTipos(): Promise<void> {
    const data = await this.sbProductoService.getTipos();
    this.tipos = data as Tipo[];
  }

  async loadColores(): Promise<void> {
    const data = await this.sbProductoService.getColores();
    this.colores = data as Color[];
  }

  // Toggle del menú
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  // Getter para obtener productos filtrados
  get filteredProductos(): Producto[] {
    return this.productos.filter(prod => {
      if (this.filtroTipo !== null && prod.idtipo !== this.filtroTipo) return false;
      if (this.filtroCategoria !== null && prod.idcategoria !== this.filtroCategoria) return false;
      if (this.filtroTalla !== null && prod.idtalla !== this.filtroTalla) return false;
      if (this.filtroColor !== null && prod.idcolor !== this.filtroColor) return false;
      return true;
    });
  }

  // Getter para el total de artículos en el carrito
  get cartItemCount(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  // Getter para el total del carrito
  get cartTotal(): number {
    return this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  // Getter para el mensaje de WhatsApp (URL-encoded)
  get whatsappMessage(): string {
    let mensaje = "Pedido:\n";
    this.carrito.forEach(item => {
      mensaje += `${item.nombre} (Desc: ${item.descuento}%) x ${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    mensaje += `\nTotal: $${this.cartTotal.toFixed(2)}`;
    return encodeURIComponent(mensaje);
  }

  // Mostrar notificación temporal
  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }

  // Agregar producto al carrito
  addToCart(prod: Producto, cantidad: number): void {
    const index = this.carrito.findIndex(item => item.id === prod.id);
    if (index !== -1) {
      const nuevaCantidad = this.carrito[index].cantidad + cantidad;
      this.carrito[index].cantidad = nuevaCantidad > prod.cantidad ? prod.cantidad : nuevaCantidad;
    } else {
      const precioConDescuento = prod.precio - (prod.precio * prod.descuento / 100);
      this.carrito.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: precioConDescuento,
        cantidad: cantidad,
        stock: prod.cantidad,
        descuento: prod.descuento
      });
    }
    this.showNotification("Producto agregado correctamente");
  }

  // Eliminar producto del carrito
  removeFromCart(productId: number): void {
    this.carrito = this.carrito.filter(item => item.id !== productId);
  }

  // Métodos para cambiar filtros
  setTipo(tipoId: number): void {
    this.filtroTipo = tipoId;
  }
  setCategoria(categoriaId: number | null): void {
    this.filtroCategoria = categoriaId;
  }
  setTalla(tallaId: number | null): void {
    this.filtroTalla = tallaId;
  }
  setColor(colorId: number | null): void {
    this.filtroColor = colorId;
  }

  // Eventos de cambio en los selects
  onCategoriaChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.setCategoria(value ? +value : null);
    this.currentPage = 1;
    this.updatePagination();
  }
  onTallaChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.setTalla(value ? +value : null);
    this.currentPage = 1;
    this.updatePagination();
  }
  onColorChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.setColor(value ? +value : null);
    this.currentPage = 1;
    this.updatePagination();
  }

  // Incrementar y decrementar cantidad seleccionada en un producto
  increaseQuantity(prod: Producto): void {
    if (prod.selectedQuantity! < prod.cantidad) {
      prod.selectedQuantity!++;
    }
  }
  decreaseQuantity(prod: Producto): void {
    if (prod.selectedQuantity! > 1) {
      prod.selectedQuantity!--;
    }
  }

  // Abrir y cerrar modal del producto
  abrirModalProducto(prod: Producto): void {
   
    this.selectedProduct = prod;
    this.showProductModal = true;
    console.log("Modal abierto:", this.showProductModal);
  }
  closeProductModal(): void {
    this.showProductModal = false;
  }

  // Abrir y cerrar modal del carrito
  openCartModal(): void {
    this.showCartModal = true;
  }
  closeCartModal(): void {
    this.showCartModal = false;
  }

  // Métodos de paginación
  updatePagination(): void {
    // Calcula el total de páginas en función del número de productos filtrados
    this.totalPages = Math.max(Math.ceil(this.filteredProductos.length / this.itemsPerPage), 1);
    
    // Si la página actual supera el total (por ejemplo, al aplicar filtros) se reajusta
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    
    // En caso de que no haya productos, aseguramos que la página actual sea 1
    if (this.totalPages === 0) {
      this.currentPage = 1;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
