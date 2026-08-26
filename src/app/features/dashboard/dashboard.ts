import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RequirementService } from '../../core/services/requirement.service';
import { Requirement, RequirementStatus } from '../../core/models/requirement';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  private requirementService = inject(RequirementService);
  private sub?: Subscription;

  pendientes: Requirement[] = [];
  enProceso: Requirement[] = [];
  completados: Requirement[] = [];

  ngOnInit() {
    this.sub = this.requirementService.requirements$.subscribe(reqs => {
      this.pendientes = reqs.filter(r => r.status === 'Pendiente');
      this.enProceso = reqs.filter(r => r.status === 'En Proceso');
      this.completados = reqs.filter(r => r.status === 'Completado');
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  drop(event: CdkDragDrop<Requirement[]>, newStatus: RequirementStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const requirement = event.previousContainer.data[event.previousIndex];
      // Move visually before state sync to keep UI snappy
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      // Update global state
      this.requirementService.updateStatus(requirement.id, newStatus);
    }
  }
}