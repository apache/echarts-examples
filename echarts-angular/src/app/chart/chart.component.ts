import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  chart!: echarts.ECharts;
  data = [10, 20, 30, 40, 50];
  intervalId!: any;

  title = 'echarts-angular';

  // Pill links
  pills = [
    { title: 'Explore the Docs', link: 'https://angular.dev' },
    { title: 'Learn with Tutorials', link: 'https://angular.dev/tutorials' },
    { title: 'Prompt and best practices for AI', link: 'https://angular.dev/ai/develop-with-ai' },
    { title: 'CLI Docs', link: 'https://angular.dev/tools/cli' },
    { title: 'Angular Language Service', link: 'https://angular.dev/tools/language-service' },
    { title: 'Angular DevTools', link: 'https://angular.dev/tools/devtools' }
  ];

  ngAfterViewInit() {
    // Initialize chart
    this.chart = echarts.init(document.getElementById('chart')!);
    this.renderChart();

    // Live data update every second
    this.intervalId = setInterval(() => {
      this.data = this.data.map(v => v + Math.round(Math.random() * 10 - 5));
      this.renderChart();
    }, 1000);
  }

  renderChart() {
    this.chart.setOption({
      title: { text: 'Live Updating Chart' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: this.data, smooth: true }]
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.chart.dispose();
  }
}
