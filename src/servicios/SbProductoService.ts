import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environments';  

@Injectable({
  providedIn: 'root'
})
export class SbProductoService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getProductos(): Promise<any[]> {
    const { data, error } = await this.supabase.from('productos').select('*').order('id', { ascending: true });
    if (error) {
      console.error("Error al obtener productos", error);
      return [];
    }
    return data;
  }

  async getTallas(): Promise<any[]> {
    const { data, error } = await this.supabase.from('tallas').select('*');
    if (error) {
      console.error("Error al obtener tallas", error);
      return [];
    }
    return data;
  }

  async getCategorias(): Promise<any[]> {
    const { data, error } = await this.supabase.from('categorias').select('*');
    if (error) {
      console.error("Error al obtener categorias", error);
      return [];
    }
    return data;
  }

  async getTipos(): Promise<any[]> {
    const { data, error } = await this.supabase.from('tipos').select('*');
    if (error) {
      console.error("Error al obtener tipos", error);
      return [];
    }
    return data;
  }

  async getColores(): Promise<any[]> {
    const { data, error } = await this.supabase.from('colores').select('*');
    if (error) {
      console.error("Error al obtener colores", error);
      return [];
    }
    return data;
  }


   // Método para crear un nuevo producto





   
   async createProductoConTallas(producto: any, tallas: { idtalla: number; cantidad: number }[]): Promise<any> {
    // Insertar el producto y obtener su id
    const { data: productoData, error: productoError } = await this.supabase
      .from('productos')
      .insert(producto)
      .select('id')  // Solicita el id generado
      .single();     // Dado que es un solo producto
  
    if (productoError) {
      console.error("Error al crear producto:", productoError);
      return { success: false, message: "❌ Error al crear producto" };
    }
  
    // Extraer el id del producto insertado
    const idProducto = productoData.id;
  
    // Preparar los datos para la tabla intermedia
    const datosIntermedios = tallas.map((talla) => ({
      idproducto: idProducto,
      idtalla: talla.idtalla,
      cantidad: talla.cantidad
    }));
  
    // Insertar datos en la tabla intermedia
    const { data: interData, error: interError } = await this.supabase
      .from('productotalla')  // Cambia el nombre por el de tu tabla intermedia
      .insert(datosIntermedios);
  
    if (interError) {
      console.error("Error al insertar datos en tabla intermedia:", interError);
      return { success: false, message: "❌ Error al insertar datos en tabla intermedia" };
    }
  
    return {
      success: true,
      message: "✅ Producto y datos intermedios creados exitosamente",
      id: idProducto
    };
  }




  
  async updateProductoConTallas(producto: any, tallas: { idtalla: number; cantidad: number }[]): Promise<any> {
    // Actualizar el producto en la tabla 'productos'
    const { data: productoData, error: productoError } = await this.supabase
      .from('productos')
      .update(producto)
      .eq('id', producto.id);
  
    if (productoError) {
      console.error("Error al actualizar producto:", productoError);
      return { success: false, message: "❌ Error al actualizar el producto" };
    }
  
    // Eliminar registros antiguos en la tabla intermedia para evitar inconsistencias
    const { error: deleteError } = await this.supabase
      .from('productotalla')  // Cambia al nombre real de tu tabla intermedia
      .delete()
      .eq('idproducto', producto.id);
  
    if (deleteError) {
      console.error("Error al eliminar registros antiguos en tabla intermedia:", deleteError);
      return { success: false, message: "❌ Error al actualizar las tallas del producto" };
    }
  
    // Insertar los nuevos registros en la tabla intermedia
    const datosIntermedios = tallas.map((talla) => ({
      idproducto: producto.id,
      idtalla: talla.idtalla,
      cantidad: talla.cantidad
    }));
  
    const { error: insertError } = await this.supabase
      .from('productotalla')  // Cambia al nombre real de tu tabla intermedia
      .insert(datosIntermedios);
  
    if (insertError) {
      console.error("Error al insertar datos en tabla intermedia:", insertError);
      return { success: false, message: "❌ Error al actualizar las tallas del producto" };
    }
  
    return { success: true, message: "✅ Producto y tallas actualizados exitosamente" };
  }
  






  async eliminarProducto(id: number): Promise<boolean> {
    // Eliminar registros en la tabla intermedia relacionados con el producto
    const { error: deleteInterError } = await this.supabase
      .from('tabla_intermedia')  // Cambia al nombre real de tu tabla intermedia
      .delete()
      .eq('idproducto', id);
  
    if (deleteInterError) {
      console.error("Error al eliminar registros en tabla intermedia:", deleteInterError);
      return false;
    }
  
    // Eliminar el producto de la tabla 'productos'
    const { error: deleteProductError } = await this.supabase
      .from('productos')
      .delete()
      .eq('id', id);
  
    if (deleteProductError) {
      console.error("Error al eliminar producto:", deleteProductError);
      return false;
    }
  
    return true;
  }
  




  async getProductoById(id: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single(); // Asumimos que el ID es único
    if (error) {
      console.error("Error al obtener producto por ID:", error);
      return null;
    }
    return data;
  }




  async getTallasByProductoId(idProducto: number): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('productotalla') // Cambia al nombre real de tu tabla intermedia
      .select('*')
      .eq('idproducto', idProducto);
  
    if (error) {
      console.error("Error al obtener tallas del producto:", error);
      return [];
    }
  
    return data;
  }
  

  
  
}
