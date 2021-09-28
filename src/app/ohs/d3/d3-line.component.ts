import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-d3-line',
  template: `
    <ngx-charts-line-chart
      [scheme]="colorScheme"
      [results]="multi"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel">
    </ngx-charts-line-chart>
  `,
})
export class D3LineComponent implements OnDestroy {
  multi = [
    {
      name: 'BTS',
      series: [
        {
          name: 'January',
          value: 35,
        },
        {
          name: 'February',
          value: 29,
        },
        {
          name: 'March',
          value: 25,
        },
        {
          name: 'May',
          value: 8,
        },
      ],
    },
    {
      name: 'Fiber',
      series: [
        {
          name: 'January',
          value: 50,
        },
        {
          name: 'February',
          value: 38,
        },
        {
          name: 'March',
          value: 32,
        },
        {
          name: 'May',
          value: 10,
        },
      ],
    },
    {
      name: 'MS',
      series: [
        {
          name: 'January',
          value: 15,
        },
        {
          name: 'February',
          value: 12,
        },
        {
          name: 'March',
          value: 4,
        },
        {
          name: 'May',
          value: 1,
        },
      ],
    },
  ];
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Incidents';
  colorScheme: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.dangerLight, colors.successLight, colors.warningLight, colors.infoLight],
      };
    });
  }

  ngOnDestroy(): void {
    // this.themeSubscription.unsubscribe();
  }
}
