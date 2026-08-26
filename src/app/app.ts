import { Component } from '@angular/core';
import { DashboardComponent } from './features/dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent],
  template: `<app-dashboard></app-dashboard>`,
  styleUrls: ['./app.css']
})

export class App {
  title = 'tareas-dashboard';
}