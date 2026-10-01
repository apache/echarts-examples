import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartComponent } from './chart/chart.component';  

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('echarts-angular');
}
