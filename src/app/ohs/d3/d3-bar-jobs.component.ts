import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {DashboardOhsService} from '../../@core/services/dashboard-ohs.service';

@Component({
  selector: 'ngx-d3-bar-jobs',
  template: `
    <ngx-charts-bar-vertical
      [scheme]="colorScheme"
      [results]="results"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel">
    </ngx-charts-bar-vertical>
  `,
})
export class D3BarJobsComponent implements OnInit, OnDestroy {
  jobsReport: any = [];

  results = [
    {name: 'Approved', value: 300},
    {name: 'Rejected', value: 400},
    {name: 'Expired', value: 100},
  ];
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  xAxisLabel = 'Status';
  yAxisLabel = 'Population';
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

  ngOnInit(): void {
    this.getTicketsReport();
  }


  constructor(private theme: NbThemeService, private dashService: DashboardOhsService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      /*
       this.colorScheme = {
         domain: [colors.warningLight, colors.successLight, colors.infoLight, colors.dangerLight, colors.primaryLight],
       };
      */
    });
  }


  getTicketsReport() {
    this.dashService.fetchTicketReport()
      .pipe()
      .subscribe(
        data => {
          this.jobsReport = data.results[0];
          // console.log(this.ptwReport.received_ptws);
          this.results = [
            {name: 'Approved', value: this.jobsReport.ohs_approved + this.jobsReport.ohs_expired},
            {name: 'Rejected', value: this.jobsReport.ohs_rejected},
            {name: 'Open', value: this.jobsReport.ohs_open},
          ];
        }, error => {

        },
      );
  }


  ngOnDestroy(): void {
    // this.themeSubscription.unsubscribe();
  }


}
