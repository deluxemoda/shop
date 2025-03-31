import { Routes } from '@angular/router';
import { NavegacionComponent } from './navegacion/navegacion.component';
import { InicioComponent } from './inicio/inicio.component'; 
import { PieComponent } from './pie/pie.component'; 
import { CabeceraComponent } from './cabecera/cabecera.component';
import { CabeceradosComponent } from './cabecerados/cabecerados.component';
import { MenuComponent } from './menu/menu.component';
import { RopaComponent } from './ropa/ropa.component'; 
import { MaquillajeComponent } from './maquillaje/maquillaje.component'; 
import { HogarComponent } from './hogar/hogar.component';  
import { PiedosComponent } from './piedos/piedos.component';
import { JoyeriaComponent } from './joyeria/joyeria.component';
import { ZapatosComponent } from './zapatos/zapatos.component';
import { AccesoriosComponent } from './accesorios/accesorios.component';
import { CabeceratresComponent } from './cabeceratres/cabeceratres.component';  

import { CrearProductoComponent } from './crear-producto/crear-producto.component'; 
import { ListarProductosComponent } from './listar-productos/listar-productos.component';

export const routes: Routes = [
    { path: 'navegacion', component: NavegacionComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'pie', component: PieComponent },
    { path: 'piedos', component: PiedosComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'cabecera', component: CabeceraComponent },
    { path: 'cabecerados', component: CabeceradosComponent },
    { path: 'ropa', component: RopaComponent },
    { path: 'maquillaje', component: MaquillajeComponent },
    { path: 'hogar', component: HogarComponent },
    { path: 'crearproducto', component: CrearProductoComponent },
    { path: 'crearproducto/:id', component: CrearProductoComponent },
    { path: 'listarproducto', component: ListarProductosComponent },
    { path: 'cabeceratres', component: CabeceratresComponent },
    
    { path: 'joyeria', component: JoyeriaComponent },
    { path: 'zapatos', component: ZapatosComponent },
    { path: 'accesorios', component: AccesoriosComponent },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta por defecto
    { path: '**', redirectTo: '/inicio' } // Ruta para manejar errores (opcional)
  ];
