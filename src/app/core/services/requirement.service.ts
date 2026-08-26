import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Requirement } from '../models/requirement';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  // Estado Global
  private requirementsSubject = new BehaviorSubject<Requirement[]>([]);
  public requirements$: Observable<Requirement[]> = this.requirementsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  // data inicial estructurado con campos
  private loadInitialData() {
    const mockData: Requirement[] = [
      {
        id: '1',
        title: 'Configurar entorno Docker',
        description: 'Crear Dockerfile y docker-compose.yml',
        status: 'Completado',
        priority: 'Alta',
        assignee: 'Diego',
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Implementar RxJS',
        description: 'Crear el servicio de estado global',
        status: 'En Proceso',
        priority: 'Alta',
        assignee: 'Diego',
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Diseñar UI',
        description: 'Maquetar el dashboard y los filtros',
        status: 'Pendiente',
        priority: 'Media',
        assignee: 'Diego',
        createdAt: new Date()
      }
    ];
    this.requirementsSubject.next(mockData);
  }

  // 3. Acciones de modificación (Tus "reducers")
  addRequirement(requirement: Requirement) {
    const currentList = this.requirementsSubject.getValue();
    this.requirementsSubject.next([...currentList, requirement]);
  }

  updateStatus(id: string, newStatus: Requirement['status']) {
    const currentList = this.requirementsSubject.getValue();
    const updatedList = currentList.map(req =>
      req.id === id ? { ...req, status: newStatus, modifiedAt: new Date() } : req
    );
    this.requirementsSubject.next(updatedList);
  }
}