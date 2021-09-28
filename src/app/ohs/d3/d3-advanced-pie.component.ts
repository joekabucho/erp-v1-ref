import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-d3-advanced-pie',
  template: `
    <ngx-charts-advanced-pie-chart
      [scheme]="colorScheme"
      [results]="single">
    </ngx-charts-advanced-pie-chart>
  `,
})
export class D3AdvancedPieComponent implements OnDestroy {
  single = [
    { name: 'Approved', value: 30 },
    { name: 'Pending', value: 50 },
    { name: 'Rejected', value: 10 },
  ];
  colorScheme: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.successLight, colors.warningLight, colors.dangerLight, colors.infoLight, colors.primaryLight],
      };
    });
  }

  ngOnDestroy(): void {
    // this.themeSubscription.unsubscribe();
  }
}
