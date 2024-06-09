import { Component, Input, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IData } from '../contracts';

@Component({
  selector: 'app-demo-chart',
  standalone: true,
  imports: [],
  templateUrl: './demo-chart.component.html',
  styleUrl: './demo-chart.component.scss'
})
export class DemoChartComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.initChart(`demo-chart-${this.data.id}`)
  }
  protected chart!: any
  @Input() data!: IData

  initChart(id:string) {
    new Chart(id, {
      type: 'line',
      data: {// values on X-Axis
        datasets: this.data.datasets
      },
      options: {
        aspectRatio:2.5,
        scales: {
          x: {
            title: {
              display: true,
              text: this.data.axes.x
            }
          },
          y: {
            title: {
              display: true,
              text: this.data.axes.y
            }
          },
        }
      }
      
    });
    
  }
}
