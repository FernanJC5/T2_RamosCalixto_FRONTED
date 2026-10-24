import { Component, OnInit, inject, signal } from '@angular/core';
import { AlumnoService } from '../../services/alumno';
import { Alumno } from '../../models/alumno';

@Component({
  selector: 'app-alumno-list',
  imports: [],
  templateUrl: './alumno-list.html',
  styleUrl: './alumno-list.scss'
})
export class AlumnoList implements OnInit {
  private servicio = inject(AlumnoService);
  alumnos = signal<Alumno[]>([]);
  error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.servicio.listar().subscribe({
      next: (data) => {
        this.alumnos.set(data);
        this.error.set('');
      },
      error: () => this.error.set('No se pudo conectar con la API. Verifique que el backend esté activo.')
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Desea eliminar este alumno?')) {
      return;
    }
    this.servicio.eliminar(id).subscribe({
      next: () => this.alumnos.update((lista) => lista.filter((a) => a.id !== id)),
      error: () => this.error.set('No se pudo eliminar el alumno.')
    });
  }
}
