import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {DashboardOhsService} from '../../@core/services/dashboard-ohs.service';

@Component({
  selector: 'ngx-d3-bar-ptw-per',
  template: `
<!--    <ngx-charts-bar-vertical-->
<!--      [scheme]="colorScheme"-->
<!--      [results]="results"-->
<!--      [xAxis]="showXAxis"-->
<!--      [yAxis]="showYAxis"-->
<!--      [legend]="showLegend"-->
<!--      [xAxisLabel]="xAxisLabel"-->
<!--      [yAxisLabel]="yAxisLabel"-->
<!--      [roundEdges]="false">-->
<!--    </ngx-charts-bar-vertical>-->
    <ngx-charts-pie-chart
      [scheme]="colorScheme"
      [results]="results"
      [legend]="showLegend"
      [labels]="false"
    >
    </ngx-charts-pie-chart>
  `,
})
export class D3BarPtwPerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ptwChildMessage: any;

  ngOnChanges(changes: SimpleChanges) {

    // this.doSomething(changes.categoryId.currentValue);
    // console.log(this.childMessage.S + 'that changed');
    this.getPtwPer(this.ptwChildMessage.S, this.ptwChildMessage.T, this.ptwChildMessage.SY, this.ptwChildMessage.EY);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

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

  constructor(private theme: NbThemeService, private dashService: DashboardOhsService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      // const colors: any = config.variables;
      /*
       this.colorScheme = {
         domain: [colors.warningLight, colors.successLight, colors.infoLight, colors.dangerLight, colors.primaryLight],
       };
      */
    });
  }


  ngOnInit() {
    this.getPtwPer('', '', '', '');
  }

  getPtwPer(safety: String, technician: String, start_date: String, end_date: String) {
    this.dashService.fetchPTWApprovals(safety, technician, start_date, end_date)
      .pipe()
      .subscribe(
        data => {
          const report = data.results[0];
          // console.log(report.all_ticket);
          this.results = [
            {name: 'Approved', value: report.approved_permits + report.expired_permits},
            {name: 'Rejected', value: report.rejected_permits},
            {name: 'Open', value: report.open_permits},
          ];
        }, error => {

        },
      );
  }


  ngOnDestroy(): void {
    // this.themeSubscription.unsubscribe();
  }

}
