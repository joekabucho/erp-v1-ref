import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {ReportService} from '../../@core/services/report.service';
import * as jwt_decode from 'jwt-decode';
import {
  faChartArea,
  faChartBar,
  faChartLine,
  faChartPie,
  faCircleNotch,
  faCompass,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {Color, Label, ThemeService} from 'ng2-charts';
import {TaskService} from '../../@core/services/task.service';
import {DatePipe} from '@angular/common';
import {DashboardOpsService} from '../../@core/services/dashboard-ops.service';

interface CardSettings {
  id: number;
  title: string;
  iconClass: string;
  type: string;
  projects: number;
}

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
  providers: [ThemeService],
  styleUrls: ['./e-commerce.component.css'],

})
export class ECommerceComponent implements OnDestroy, OnInit {


  /*
  START OF NEW DASHBOARD ANALYTICS LOGIC BY ARNOLD
  */

  taskStatusResults: any = [];
  taskAdditionTrendsResults: any[] = [];
  taskDistributionPerTeamResults: any = [];
  allTasks: any = 0;

  // view: any[] = [700, 300];

  results = [
    {name: 'In Progress', value: 300},
    {name: 'Overdue', value: 400},
    {name: 'Done', value: 100},
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


  ptwReport: any;
  ptwReportResult: any;

  taskDistributionResults: any[] = [];
  // showLegend: boolean = true;
  showLabels: boolean = true;

  // options
  legend: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;

  timeline: boolean = true;
  trendxAxisLabel: string = 'Months';
  trendyAxisLabel: string = 'Tasks';

  teams: any = [
    {name: 'Fibre'},
    {name: 'All'},
  ];

  getTaskStatus() {
    this.dashboardService.fetchTaskStatus()
      .pipe()
      .subscribe(
        data => {
          const taskData = data.results[0];
          this.allTasks = taskData.all_tasks;
          this.taskStatusResults = [
            {name: 'Open', value: taskData.open_tasks},
            {name: 'Closed', value: taskData.closed_tasks},
            {name: 'Overdue', value: taskData.overdue_tasks},
            {name: 'Pending', value: taskData.tasks_not_started},
          ];
        }, error => {

        },
      );
  }

  getTaskDistributionPerTeam() {
    this.dashboardService.fetchTaskDistributionPerTeam()
      .pipe()
      .subscribe(
        data => {
          const taskData = data.results[0];
          const teamNamesArray: [] = taskData.team_names;
          const teamDataArray: [] = taskData.team_tasks;
          const taskDistData = [];

          for (let i = 0; i < teamNamesArray.length; i++) {
            taskDistData.push({name: teamNamesArray[i], value: teamDataArray[i]});
            this.getRandomColor();
          }
          this.taskDistributionResults = taskDistData;
        }, error => {

        },
      );
  }

  getTaskTrend() {

    this.dashboardService.fetchTaskAdditionTrends()
      .pipe()
      .subscribe(
        data => {
          const taskData: any[] = data.results;
          const taskTrendData = [];
          for (let i = 0; i < taskData.length; i++) {
            taskTrendData.push({name: taskData[i].month_details, value: taskData[i].total_monthly_tasks});
          }
          // To populate the graph
          this.taskAdditionTrendsResults = [
            {
              'name': 'Tasks',
              'series': taskTrendData,
            },
          ];

        }, error => {

        },
      );
  }

  getRandomColor() {
    const x = Math.round(0xffffff * Math.random()).toString(16);
    const y = (6 - x.length);
    const z = '000000';
    const z1 = z.substring(0, y);
    const color = '#' + z1 + x;
    this.colorScheme.domain.push(color);
  }

  /*
  END OF NEW ANALYTICS LOGIC
  */


  private alive = true;
  projects;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser;

  bar = faChartBar;
  line = faChartLine;
  area = faChartArea;
  pie = faChartPie;
  stack = faDatabase;
  doughnut = faCircleNotch;
  radar = faCompass;
  optionValue = 'bar';
  optionValue1 = 'bar1';
  optionValue2 = 'pie';


  tasks: any = [];
  taskDates: any = [];
  taskJan: any = [];
  taskFeb: any = [];
  taskMar: any = [];
  taskApr: any = [];
  taskMay: any = [];
  taskJun: any = [];
  taskJul: any = [];
  taskAug: any = [];
  taskSep: any = [];
  taskOct: any = [];
  taskNov: any = [];
  taskDec: any = [];
  taskJanOverdue: any = [];
  taskFebOverdue: any = [];
  taskMarOverdue: any = [];
  taskAprOverdue: any = [];
  taskMayOverdue: any = [];
  taskJunOverdue: any = [];
  taskJulOverdue: any = [];
  taskAugOverdue: any = [];
  taskSepOverdue: any = [];
  taskOctOverdue: any = [];
  taskNovOverdue: any = [];
  taskDecOverdue: any = [];
  taskJanCompleted: any = [];
  taskFebCompleted: any = [];
  taskMarCompleted: any = [];
  taskAprCompleted: any = [];
  taskMayCompleted: any = [];
  taskJunCompleted: any = [];
  taskJulCompleted: any = [];
  taskAugCompleted: any = [];
  taskSepCompleted: any = [];
  taskOctCompleted: any = [];
  taskNovCompleted: any = [];
  taskDecCompleted: any = [];
  taskDateCompleted;
  notComplete = null;
  workload: number;

  solarValue: number;
  openCard: CardSettings = {
    id: 1,
    title: 'Open',
    iconClass: 'bulb-outline',
    type: 'info',
    projects: 0,
  };
  onTrackCard: CardSettings = {
    id: 2,
    title: 'On Track',
    iconClass: 'bar-chart',
    type: 'warning',
    projects: 0,
  };
  offTrackCard: CardSettings = {
    id: 3,
    title: 'Off Track',
    iconClass: 'close',
    type: 'danger',
    projects: 0,
  };
  closedCard: CardSettings = {
    id: 4,
    title: 'Closed',
    iconClass: 'checkmark-circle',
    type: 'success',
    projects: 0,
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.openCard,
    this.onTrackCard,
    this.offTrackCard,
    this.closedCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.openCard,
        type: 'info',
      },
      {
        ...this.onTrackCard,
        type: 'warning',
      },
      {
        ...this.offTrackCard,
        type: 'danger',
      },
      {
        ...this.closedCard,
        type: 'success',
      },
    ],
    dark: this.commonStatusCardsSet,
  };
  public selectedItem: string;

  constructor(
    private themeService: NbThemeService,
    private reportService: ReportService,
    private taskService: TaskService,
    private datePipe: DatePipe,
    private dashboardService: DashboardOpsService,
  ) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });
    this.loggedInUser = jwt_decode(this.userToken);
    this.getAllProject();
  }

  ngOnInit() {
    this.selectedItem = 'bar';
    this.taskService.refresh$.subscribe(
      () => {
        this.getTasks();
      },
    );
    this.getTasks();
    this.transformDate();
    this.getTaskStatus();
    this.getTaskDistributionPerTeam();
    this.getTaskTrend();
  }

  transformDate() {
    this.taskDateCompleted = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }

  calcDaysDiff(dateStarted) {
    const date1: any = new Date(dateStarted);
    const date2: any = new Date;
    return Math.abs(Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)));
  }

  getTasks() {
    let alltasks = [];
    let taskOwner = [];
    this.taskService.fetchTask()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          alltasks = data.results;
          this.tasks = alltasks.filter(
            dates => this.calcDaysDiff(dates.date_started) < 5,
          );
          taskOwner = alltasks.map(
            dates => dates.assign.name === this.tasks.assign.name,
          );
          this.workload = (taskOwner.length / alltasks.length) * 100;
          this.taskJan = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '01',
          );
          this.taskFeb = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '02',
          );
          this.taskMar = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '03',
          );
          this.taskApr = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '04',
          );
          this.taskMay = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '05',
          );
          this.taskJun = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '06',
          );
          this.taskJul = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '07',
          );
          this.taskAug = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '08',
          );
          this.taskSep = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '09',
          );
          this.taskOct = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '10',
          );
          this.taskNov = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '11',
          );
          this.taskDec = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '12',
          );
          this.taskJanOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '01'
              && dates.status === 'Overdue',
          );
          this.taskFebOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '02'
              && dates.status === 'Overdue',
          );
          this.taskMarOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '03'
              && dates.status === 'Overdue',
          );
          this.taskAprOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '04'
              && dates.status === 'Overdue',
          );
          this.taskMayOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '05'
              && dates.status === 'Overdue',
          );
          this.taskJunOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '06'
              && dates.status === 'Overdue',
          );
          this.taskJulOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '07'
              && dates.status === 'Overdue',
          );
          this.taskAugOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '08'
              && dates.status === 'Overdue',
          );
          this.taskSepOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '09'
              && dates.status === 'Overdue',
          );
          this.taskOctOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '10'
              && dates.status === 'Overdue',
          );
          this.taskNovOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '11'
              && dates.status === 'Overdue',
          );
          this.taskDecOverdue = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '12'
              && dates.status === 'Overdue',
          );

          this.taskJanCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '01'
              && dates.status === 'Completed',
          );
          this.taskFebCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '02'
              && dates.status === 'Completed',
          );
          this.taskMarCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '03'
              && dates.status === 'Completed',
          );
          this.taskAprCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '04'
              && dates.status === 'Completed',
          );
          this.taskMayCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '05'
              && dates.status === 'Completed',
          );
          this.taskJunCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '06'
              && dates.status === 'Completed',
          );
          this.taskJulCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '07'
              && dates.status === 'Completed',
          );
          this.taskAugCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '08'
              && dates.status === 'Completed',
          );
          this.taskSepCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '09'
              && dates.status === 'Completed',
          );
          this.taskOctCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '10'
              && dates.status === 'Completed',
          );
          this.taskNovCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '11'
              && dates.status === 'Completed',
          );
          this.taskDecCompleted = alltasks.filter(
            dates => dates.updated_at.split('-', 2)[0] === '2020' && dates.updated_at.split('-', 2)[1] === '12'
              && dates.status === 'Completed',
          );


          this.barChartData = [
            {
              data: [this.taskJan.length, this.taskFeb.length,
                this.taskMar.length, this.taskApr.length,
                this.taskMay.length, this.taskJun.length,
                this.taskJul.length, this.taskAug.length,
                this.taskSep.length, this.taskOct.length,
                this.taskNov.length, this.taskDec.length], label: 'tasks',
            },
          ];
          this.barTaskChartData = [
            {
              data: [this.taskJan.length, this.taskFeb.length,
                this.taskMar.length, this.taskApr.length,
                this.taskMay.length, this.taskJun.length,
                this.taskJul.length, this.taskAug.length,
                this.taskSep.length, this.taskOct.length,
                this.taskNov.length, this.taskDec.length], label: 'tasks',
            },
            {
              data: [this.taskJanCompleted.length, this.taskFebCompleted.length,
                this.taskMarCompleted.length, this.taskAprCompleted.length,
                this.taskMayCompleted.length, this.taskJunCompleted.length,
                this.taskJulCompleted.length, this.taskAugCompleted.length,
                this.taskSepCompleted.length, this.taskOctCompleted.length,
                this.taskNovCompleted.length, this.taskDecCompleted.length], label: 'Completed',
            },
            {
              data: [this.taskJanOverdue.length, this.taskFebOverdue.length,
                this.taskMarOverdue.length, this.taskAprOverdue.length,
                this.taskMayOverdue.length, this.taskJunOverdue.length,
                this.taskJulOverdue.length, this.taskAugOverdue.length,
                this.taskSepOverdue.length, this.taskOctOverdue.length,
                this.taskNovOverdue.length, this.taskDecOverdue.length], label: 'Overdue',
            },
          ];
          this.lineChartData = [
            {
              data: [this.taskJan.length, this.taskFeb.length,
                this.taskMar.length, this.taskApr.length,
                this.taskMay.length, this.taskJun.length,
                this.taskJul.length, this.taskAug.length,
                this.taskSep.length, this.taskOct.length,
                this.taskNov.length, this.taskDec.length], label: 'tasks',
            },
          ];
          this.lineTaskChartData = [
            {
              data: [this.taskJan.length, this.taskFeb.length,
                this.taskMar.length, this.taskApr.length,
                this.taskMay.length, this.taskJun.length,
                this.taskJul.length, this.taskAug.length,
                this.taskSep.length, this.taskOct.length,
                this.taskNov.length, this.taskDec.length], label: 'tasks',
            },
            {
              data: [this.taskJanCompleted.length, this.taskFebCompleted.length,
                this.taskMarCompleted.length, this.taskAprCompleted.length,
                this.taskMayCompleted.length, this.taskJunCompleted.length,
                this.taskJulCompleted.length, this.taskAugCompleted.length,
                this.taskSepCompleted.length, this.taskOctCompleted.length,
                this.taskNovCompleted.length, this.taskDecCompleted.length], label: 'Completed',
            },
            {
              data: [this.taskJanOverdue.length, this.taskFebOverdue.length,
                this.taskMarOverdue.length, this.taskAprOverdue.length,
                this.taskMayOverdue.length, this.taskJunOverdue.length,
                this.taskJulOverdue.length, this.taskAugOverdue.length,
                this.taskSepOverdue.length, this.taskOctOverdue.length,
                this.taskNovOverdue.length, this.taskDecOverdue.length], label: 'Overdue',
            },
          ];
          this.stackedChartData = [
            {
              data: [this.taskJan.length, this.taskFeb.length,
                this.taskMar.length, this.taskApr.length,
                this.taskMay.length, this.taskJun.length,
                this.taskJul.length, this.taskAug.length,
                this.taskSep.length, this.taskOct.length,
                this.taskNov.length, this.taskDec.length], type: 'line', label: 'line-tasks',
            },
            {
              data: [this.taskJan.length, this.taskFeb.length,
                this.taskMar.length, this.taskApr.length,
                this.taskMay.length, this.taskJun.length,
                this.taskJul.length, this.taskAug.length,
                this.taskSep.length, this.taskOct.length,
                this.taskNov.length, this.taskDec.length], label: 'bar-tasks',
            },
          ];
          this.stackedTaskChartData = [
            {
              data: [this.taskJan.length, this.taskFeb.length,
                this.taskMar.length, this.taskApr.length,
                this.taskMay.length, this.taskJun.length,
                this.taskJul.length, this.taskAug.length,
                this.taskSep.length, this.taskOct.length,
                this.taskNov.length, this.taskDec.length], type: 'line', label: 'line-tasks',
            },
            {
              data: [this.taskJanCompleted.length, this.taskFebCompleted.length,
                this.taskMarCompleted.length, this.taskAprCompleted.length,
                this.taskMayCompleted.length, this.taskJunCompleted.length,
                this.taskJulCompleted.length, this.taskAugCompleted.length,
                this.taskSepCompleted.length, this.taskOctCompleted.length,
                this.taskNovCompleted.length, this.taskDecCompleted.length], type: 'line', label: 'line-Completed',
            },
            {
              data: [this.taskJanOverdue.length, this.taskFebOverdue.length,
                this.taskMarOverdue.length, this.taskAprOverdue.length,
                this.taskMayOverdue.length, this.taskJunOverdue.length,
                this.taskJulOverdue.length, this.taskAugOverdue.length,
                this.taskSepOverdue.length, this.taskOctOverdue.length,
                this.taskNovOverdue.length, this.taskDecOverdue.length], type: 'line', label: 'line-Overdue',
            },
            {
              data: [this.taskJan.length, this.taskFeb.length,
                this.taskMar.length, this.taskApr.length,
                this.taskMay.length, this.taskJun.length,
                this.taskJul.length, this.taskAug.length,
                this.taskSep.length, this.taskOct.length,
                this.taskNov.length, this.taskDec.length], label: 'bar-tasks',
            },
            {
              data: [this.taskJanCompleted.length, this.taskFebCompleted.length,
                this.taskMarCompleted.length, this.taskAprCompleted.length,
                this.taskMayCompleted.length, this.taskJunCompleted.length,
                this.taskJulCompleted.length, this.taskAugCompleted.length,
                this.taskSepCompleted.length, this.taskOctCompleted.length,
                this.taskNovCompleted.length, this.taskDecCompleted.length], label: 'bar-Completed',
            },
            {
              data: [this.taskJanOverdue.length, this.taskFebOverdue.length,
                this.taskMarOverdue.length, this.taskAprOverdue.length,
                this.taskMayOverdue.length, this.taskJunOverdue.length,
                this.taskJulOverdue.length, this.taskAugOverdue.length,
                this.taskSepOverdue.length, this.taskOctOverdue.length,
                this.taskNovOverdue.length, this.taskDecOverdue.length], label: 'bar-Overdue',
            },
          ];
        },
      );
  }


  getAllProject() {
    this.reportService.fetchProjectReports()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        (data) => {
          this.projects = data.results;
          this.openCard.projects = this.projects[0].open_projects;
          this.onTrackCard.projects = this.projects[0].projects_on_track;
          this.offTrackCard.projects = this.projects[0].projects_off_track;
          this.closedCard.projects = this.projects[0].closed_projects;

          this.doughnutChartData = [this.projects[0].open_projects, this.projects[0].projects_on_track,
            this.projects[0].projects_off_track, this.projects[0].closed_projects];
          this.radarChartData = [{
            data: [
              this.projects[0].open_projects, this.projects[0].projects_on_track,
              this.projects[0].projects_off_track, this.projects[0].closed_projects], label: 'Projects analysis',
          },
          ];
          this.pieChartData = [this.projects[0].open_projects, this.projects[0].projects_on_track,
            this.projects[0].projects_off_track, this.projects[0].closed_projects];
        });
  }

  public barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any = [{data: []}];
  public barTaskChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barTaskChartType = 'bar';
  public barTaskChartLegend = true;
  public barTaskChartData: any = [{data: []}];
  public stackedChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public stackedChartType = 'bar';
  public stackedChartLegend = true;
  public stackedChartData: any = [{data: []}];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  public stackedTaskChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'
    , 'October', 'November', 'December'];
  public stackedTaskChartType = 'bar';
  public stackedTaskChartLegend = true;
  public stackedTaskChartData: any = [{data: []}];

  public lineChartData: ChartDataSets[] = [];
  public lineTaskChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public lineTaskChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public lineChartData2025: ChartDataSets[] = [];
  public lineTaskChartData2025: ChartDataSets[] = [];
  public lineChartLabels2025: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public lineTaskChartLabels2025: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public doughnutChartLabels = ['Open Projects', 'Ontrack Projects', 'Offtrack Projects', 'Closed Projects'];
  public doughnutChartData: any = [{data: []}];
  public doughnutChartType = 'doughnut';

  public radarChartLabels = ['Open Projects', 'Ontrack Projects', 'Offtrack Projects', 'Closed Projects'];
  public radarChartData: any = [{data: []}];
  public radarChartType = 'radar';

  public pieChartLabels = ['Open Projects', 'Ontrack Projects', 'Offtrack Projects', 'Closed Projects'];
  public pieChartData: any = [{data: []}];
  public pieChartType = 'pie';

  public roundChartColors: Array<any> = [{
    backgroundColor: ['#0095ff', '#ffaa00', '#ff3d71', '#00d68f'],
  }];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(0,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          },
        },
      ],
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno',
          },
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(2,99,255,0.2)',
      borderColor: 'rgb(4,103,255)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    { // grey
      backgroundColor: 'rgb(203,106,106)',
      borderColor: 'rgb(255,2,2)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    { // grey
      backgroundColor: 'rgb(170,226,130)',
      borderColor: 'rgb(4,255,46)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';


  ngOnDestroy() {
    this.alive = false;
  }

}
