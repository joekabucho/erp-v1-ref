import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {DashboardOhsService} from '../../@core/services/dashboard-ohs.service';

@Component({
  selector: 'ngx-d3-pie-ptw',
  template: `
    <ngx-charts-pie-chart
      [scheme]="colorScheme"
      [results]="results"
      [legend]="showLegend"
      [labels]="showLabels"
    >
    </ngx-charts-pie-chart>
  `,
})
export class D3PiePtwComponent implements OnInit, OnDestroy {

  ngOnInit() {
    this.getPTWReport();
  }

  // private alive = true;
  ptwReport: any;
  ptwReportResult: any;

  results: any = [];
  showLegend: boolean = true;
  showLabels: boolean = true;
  // colorScheme: any;
  themeSubscription: any;
  colorScheme = {
    domain: [
      '#2152FF',
      '#FF6242',
      '#9E00FF',
      '#FFA800',
      '#84ACE9',
    ],
  };

  constructor(private theme: NbThemeService, private dashService: DashboardOhsService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      // const colors: any = config.variables;
      /* this.colorScheme = {
         domain: [colors.successLight, colors.warningLight, colors.dangerLight, colors.infoLight, colors.primaryLight],
       };*/
    });
  }

  getPTWReport() {
    this.dashService.fetchPTWReport()
      .pipe()
      .subscribe(
        data => {
          this.ptwReport = data.results[0];
          this.results = [
            {name: 'Approved', value: this.ptwReport.ohs_approved + this.ptwReport.ohs_expired},
            {name: 'Rejected', value: this.ptwReport.ohs_rejected},
            {name: 'Open', value: this.ptwReport.ohs_open},
          ];
        }, error => {

        },
      );
  }

  ngOnDestroy(): void {
    // this.themeSubscription.unsubscribe();
  }
}
