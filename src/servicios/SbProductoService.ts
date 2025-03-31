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





   
   async createProducto(producto: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('productos')
      .insert(producto);
    if (error) {
      console.error("Error al crear producto:", error);
      return { success: false, message: "❌ Exito al crear producto" };
    }
    return { success: true, message: "✅ Producto creado exitosamente" };
  }
  async eliminarProducto(id: number): Promise<boolean> {
    const { error } = await this.supabase.from('productos').delete().eq('id', id);
    if (error) {
      console.error("Error al eliminar producto:", error);
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

  async updateProducto(producto: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('productos')
      .update(producto)
      .eq('id', producto.id);
      
    if (error) {
      console.error("Error al actualizar producto:", error);
      return { success: false, message: "❌ Error al actualizar el producto" };
    }
    return { success: true, message: "✅ Producto actualizado exitosamente" };
  }
  
}
