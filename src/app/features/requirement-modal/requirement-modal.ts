import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Requirement, RequirementStatus } from '../../core/models/requirement';

export interface RequirementModalData {
  mode: 'create' | 'view';
  requirement?: Requirement;
  defaultStatus?: RequirementStatus;
}

@Component({
  selector: 'app-requirement-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './requirement-modal.html',
  styleUrl: './requirement-modal.css',
})
export class RequirementModal implements OnInit {
  form: FormGroup;
  mode: 'create' | 'view' | 'edit' = 'create';
  requirement?: Requirement;

  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<Requirement | { action: 'delete', id: string }>,
    @Inject(DIALOG_DATA) public data: RequirementModalData
  ) {
    this.mode = data.mode;
    this.requirement = data.requirement;

    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      title: ['', Validators.required],
      description: [''],
      status: [data.defaultStatus || 'Pendiente', Validators.required],
      priority: ['Media', Validators.required],
      assignee: ['', Validators.required],
      dueDate: [''],
      createdAt: [{ value: '', disabled: true }],
      modifiedAt: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'view' && this.requirement) {
      // Formatear fechas si existen para el input date (YYYY-MM-DD)
      let formattedDueDate = '';
      if (this.requirement.dueDate) {
        const d = new Date(this.requirement.dueDate);
        formattedDueDate = d.toISOString().split('T')[0];
      }

      this.form.patchValue({
        ...this.requirement,
        dueDate: formattedDueDate,
        createdAt: this.requirement.createdAt ? new Date(this.requirement.createdAt).toLocaleString() : '',
        modifiedAt: this.requirement.modifiedAt ? new Date(this.requirement.modifiedAt).toLocaleString() : ''
      });
      this.form.disable();
    }
  }

  enableEdit() {
    this.mode = 'edit';
    this.form.enable();
    this.form.get('id')?.disable();
    this.form.get('createdAt')?.disable();
    this.form.get('modifiedAt')?.disable();
  }

  deleteRequirement() {
    if (this.requirement) {
      this.dialogRef.close({ action: 'delete', id: this.requirement.id });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue(); // gets disabled fields too for consistency, but we overwrite them

    if (this.mode === 'create') {
      const newRequirement: Requirement = {
        ...formValue,
        id: Math.random().toString(36).substring(2, 9), // Generar ID simple
        createdAt: new Date(),
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined
      };
      this.dialogRef.close(newRequirement);
    } else if (this.mode === 'edit' && this.requirement) {
      const updatedRequirement: Requirement = {
        ...this.requirement,
        ...formValue,
        modifiedAt: new Date(),
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined
      };
      // Conservamos campos originales si no se tocaron o eran inmutables,
      // la fecha y ID ya están correctos desde this.requirement.
      this.dialogRef.close(updatedRequirement);
    }
  }
}
