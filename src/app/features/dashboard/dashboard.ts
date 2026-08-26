import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementService } from '../../core/services/requirement.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  // Conexión con el servicio.
  private requirementService = inject(RequirementService);

  // Mandar los datos a la vista
  requirements$ = this.requirementService.requirements$;
}