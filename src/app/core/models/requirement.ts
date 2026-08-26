export type RequirementStatus = 'Pendiente' | 'En Proceso' | 'Completado';
export type RequirementPriority = 'Baja' | 'Media' | 'Alta';

export interface Requirement {
    id: string;
    title: string;
    description: string;
    status: RequirementStatus;
    priority: RequirementPriority;
    assignee: string;
    createdAt: Date;
    modifiedAt?: Date;
    dueDate?: Date;
}