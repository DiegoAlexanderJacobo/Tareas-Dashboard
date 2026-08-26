import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { RequirementService } from '../../core/services/requirement.service';
import { Requirement, RequirementStatus } from '../../core/models/requirement';
import { Subscription } from 'rxjs';
import { RequirementModal, RequirementModalData } from '../requirement-modal/requirement-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DragDropModule, DialogModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  private requirementService = inject(RequirementService);
  private dialog = inject(Dialog);
  private cdr = inject(ChangeDetectorRef);
  private sub?: Subscription;

  pendientes: Requirement[] = [];
  enProceso: Requirement[] = [];
  completados: Requirement[] = [];

  ngOnInit() {
    this.sub = this.requirementService.requirements$.subscribe(reqs => {
      this.pendientes = reqs.filter(r => r.status === 'Pendiente');
      this.enProceso = reqs.filter(r => r.status === 'En Proceso');
      this.completados = reqs.filter(r => r.status === 'Completado');
      this.cdr.detectChanges(); // Forzar actualización de la vista
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
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.requirementService.updateStatus(requirement.id, newStatus);
    }
  }

  openCreateModal(defaultStatus?: RequirementStatus) {
    const dialogRef = this.dialog.open<Requirement>(RequirementModal, {
      data: { mode: 'create', defaultStatus } as RequirementModalData,
      width: '90vw',
      maxWidth: '500px',
      panelClass: 'bg-transparent',
      hasBackdrop: true,
      backdropClass: 'bg-slate-900/40' // Tailwind class for subtle dark backdrop
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.requirementService.addRequirement(result);
      }
    });
  }

  openViewModal(requirement: Requirement) {
    const dialogRef = this.dialog.open<Requirement | { action: 'delete', id: string }>(RequirementModal, {
      data: { mode: 'view', requirement } as RequirementModalData,
      width: '90vw',
      maxWidth: '500px',
      panelClass: 'bg-transparent',
      hasBackdrop: true,
      backdropClass: 'bg-slate-900/40'
    });

    dialogRef.closed.subscribe(result => {
      if (!result) return;
      
      if ('action' in result && result.action === 'delete') {
        this.requirementService.deleteRequirement(result.id);
      } else {
        // It's an updated requirement
        this.requirementService.updateRequirement(result as Requirement);
      }
    });
  }
}