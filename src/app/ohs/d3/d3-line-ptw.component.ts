import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {DashboardOhsService} from '../../@core/services/dashboard-ohs.service';

@Component({
  selector: 'ngx-d3-line-ptw',
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
    <!--    <ngx-charts-area-chart-->
    <!--      [view]="view"-->
    <!--      [scheme]="colorScheme"-->
    <!--      [legend]="legend"-->
    <!--      [showXAxisLabel]="showXAxisLabel"-->
    <!--      [showYAxisLabel]="showYAxisLabel"-->
    <!--      [xAxis]="xAxis"-->
    <!--      [yAxis]="yAxis"-->
    <!--      [xAxisLabel]="xAxisLabel"-->
    <!--      [yAxisLabel]="yAxisLabel"-->
    <!--      [timeline]="timeline"-->
    <!--      [results]="multi">-->
    <!--    </ngx-charts-area-chart>-->
  `,
})
export class D3LinePtwComponent implements OnInit, OnDestroy {
  ticketsReport: any[] = [];
  ptwReport: any[] = [];
  multi = [];

  view: any[] = [700, 300];
  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Number of PTW / Tickets';
  timeline: boolean = true;
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  themeSubscription: any;
  colorScheme = {
    domain: [
      '#2152FF',
      '#FF6242',
      '#9E00FF',
      '#FFA800',
    ],
  };

  constructor(private theme: NbThemeService, private dashboardOhsService: DashboardOhsService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      // const colors: any = config.variables;
      /*  this.colorScheme = {
          domain: [colors.primaryLight, colors.dangerLight, colors.successLight, colors.warningLight, colors.infoLight],
        };*/
    });
  }


  getPTW() {
    this.dashboardOhsService.fetchPTWMonthlyReport()
      .pipe()
      .subscribe(
        data => {
          const res = data.results[0].last_year_ohs_report.ptws;
          const tktRes = data.results[0].last_year_ohs_report.tkts;

          // console.log(Array.from(res));
          // console.log(res);
          const arr = [];
          Object.keys(res).map(function(key) {
            arr.push({name : key, value : res[key] });
            return arr;
          });
          this.ptwReport = arr;
          const ticketArr = [];
          Object.keys(tktRes).map(function(key) {
            ticketArr.push({name : key, value : tktRes[key] });
            return ticketArr;
          });
          this.ticketsReport = ticketArr;
          this.multi = [
            {
              name: 'Tickets',
              series: this.ticketsReport,
            },
            {
              name: 'PTW',
              series: this.ptwReport,
            },
          ];
        }, error => {

        },
      );
  }

  getTickets() {

  }

  monthPlacer(i: number) {
    const currentMonth: string[] = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return currentMonth[i - 1];
  }

  ngOnInit(): void {
    this.getPTW();
  }

  ngOnDestroy(): void {
    // this.themeSubscription.unsubscribe();
  }
}
