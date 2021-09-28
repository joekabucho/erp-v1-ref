import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
// import {NbThemeService} from '@nebular/theme';
import {DashboardOhsService} from '../../@core/services/dashboard-ohs.service';

@Component({
  selector: 'ngx-d3-bar-jobs-per',
  template: `
    <ngx-charts-bar-vertical
      [scheme]="colorScheme"
      [results]="results"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel"
      [roundEdges]="false">
    </ngx-charts-bar-vertical>
  `,
})
export class D3BarJobsPerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() childMessage: any;

  ngOnChanges(changes: SimpleChanges) {

    // this.doSomething(changes.categoryId.currentValue);
    // console.log(this.childMessage.S + 'that changed');
    this.getJobsPer(this.childMessage.S, this.childMessage.T, this.childMessage.SY, this.childMessage.EY);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }

  ngOnInit() {
    this.getJobsPer('', '', '', '');

  }

  selectedItem = '2';

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

  constructor( private dashService: DashboardOhsService) {

  }

  getJobsPer(safety: String, technician: String, start_date: String, end_date: String) {
    this.dashService.fetchTicketApprovals(safety, technician, start_date, end_date)
      .pipe()
      .subscribe(
        data => {
          const report = data.results[0];
          // console.log(report.all_ticket);
          this.results = [
            {name: 'Approved', value: report.approved_tickets + report.expired_tickets},
            {name: 'Rejected', value: report.rejected_tickets},
            {name: 'Open', value: report.open_tickets},
          ];
        }, error => {

        },
      );
  }


  ngOnDestroy(): void {
    // this.themeSubscription.unsubscribe();
  }
}
