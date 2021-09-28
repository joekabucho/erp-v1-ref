import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { OrdersChartComponent } from './charts/orders-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from '../../../@core/data/orders-chart';
import { ProfitChart } from '../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';
import { ReportService } from '../../../@core/services/report.service';

@Component({
  selector: 'ngx-ecommerce-charts',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ECommerceChartsPanelComponent implements OnInit, OnDestroy {

  private alive = true;

  invoiceChartPanelSummary: OrderProfitChartSummary[];
  poChartPanelSummary: OrderProfitChartSummary[];

  period: string = 'month';
  ordersChartData: OrdersChart;

  numberOfPos: number;
  numberOfInvoice: number;

  profitChartData: ProfitChart;

  @ViewChild('ordersChart', { static: true }) ordersChart: OrdersChartComponent;
  @ViewChild('profitChart', { static: true }) profitChart: ProfitChartComponent;

  constructor(
    private ordersProfitChartService: OrdersProfitChartData,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    // this.profitChart.resizeChart();
    // this.ordersChart.resizeChart();

    this.getOrdersChartData(this.period);
    this.getProfitChartData(this.period);
    this.getPoData();
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    this.getProfitChartData(value);
  }

  getPoData() {
    this.ordersProfitChartService.getOrderProfitChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe((summary) => {
        this.reportService.fetchPoReports()
          .subscribe((data) => {
            summary[0].value = 0;
            summary[1].value = 0;
            // summary[0].value = data.results[0].year_graph_data[0][6];
            // summary[1].value = data.results[0].month_graph_data[0][6];
            this.numberOfPos = data.results[0].last_year_count;
            this.poChartPanelSummary = summary;
            // console.log(data.results[0].month_graph_data[1]);
          });
      });
  }


  getInvoiceData() {
    this.ordersProfitChartService.getOrderProfitChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe((summary) => {
        this.reportService.fetchInvoiceReports()
        .subscribe(
          (data) => {
            summary[0].value = 0;
            summary[1].value = 0;
            this.numberOfInvoice = data.results[0].last_year_count;
            this.invoiceChartPanelSummary = summary;
          });
      });
  }


  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Invoices') {
      this.getInvoiceData();
      // this.profitChart.resizeChart();
    } else {
      this.getPoData();
      // this.ordersChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {
    this.ordersProfitChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });
  }


  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
