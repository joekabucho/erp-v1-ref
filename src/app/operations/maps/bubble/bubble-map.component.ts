import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';
import { registerMap } from 'echarts';

@Component({
  selector: 'ngx-bubble-map',
  styleUrls: ['./bubble-map.component.scss'],
  template: `
    <nb-card>
      <nb-card-header>Bubble Map</nb-card-header>
      <div echarts [options]="options" class="echarts"></div>
    </nb-card>
  `,
})
export class BubbleMapComponent implements OnDestroy {

  latlong: any = {};
  mapData: any[];
  max = -Infinity;
  min = Infinity;
  options: any;

  bubbleTheme: any;
  geoColors: any[];

  private alive = true;

  constructor(private theme: NbThemeService,
              private http: HttpClient) {

    combineLatest([
      this.http.get('assets/map/world.json'),
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([map, config]: [any, any]) => {

        registerMap('world', map);

        const colors = config.variables;
        this.bubbleTheme = config.variables.bubbleMap;
        this.geoColors = [colors.primary, colors.info, colors.success, colors.warning, colors.danger];

        this.latlong = {


          'Nai': { 'latitude': -1.286389, 'longitude': 36.817223 },
          'Momb': { 'latitude': -4.036878, 'longitude': 39.669571 },
          'Kis': { 'latitude': -0.091702, 'longitude': 34.767956 },
          'Kit': { 'latitude': 1.019089, 'longitude': 35.002304 },
          'Nak': { 'latitude': -0.303099, 'longitude': 36.080025 },
          'Eld': { 'latitude': 0.514277, 'longitude': 35.269779 },
          'Kik': { 'latitude': -1.254337, 'longitude': 36.681660 },




        };





        this.mapData = [

          { 'code': 'Nai', 'name': 'Kidaya', 'value': 1, 'color': this.getRandomGeoColor() },
          { 'code': 'Momb', 'name': 'Voi', 'value': 31, 'color': this.getRandomGeoColor() },
          { 'code': 'Kis', 'name': 'Mumui', 'value': 3, 'color': this.getRandomGeoColor() },
          { 'code': 'Kit', 'name': 'Kitale', 'value': 4, 'color': this.getRandomGeoColor() },
          { 'code': 'Nak', 'name': 'Nakuru', 'value': 12, 'color': this.getRandomGeoColor() },
          { 'code': 'Eld', 'name': 'Eldoret', 'value': 20, 'color': this.getRandomGeoColor() },
          { 'code': 'Kik', 'name': 'Kikuyu', 'value': 27, 'color': this.getRandomGeoColor() },


        ];

        this.mapData.forEach((itemOpt) => {
          if (itemOpt.value > this.max) {
            this.max = itemOpt.value;
          }
          if (itemOpt.value < this.min) {
            this.min = itemOpt.value;
          }
        });

        this.options = {
          title: {
            text: 'Site Distribution across the country (2020)',
            left: 'center',
            top: '16px',
            textStyle: {
              color: this.bubbleTheme.titleColor,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: params => {
              return `${params.name}: ${params.value[2]}`;
            },
          },
          visualMap: {
            show: false,
            min: 0,
            max: this.max,
            inRange: {
              symbolSize: [6, 60],
            },
          },
          geo: {
            name: 'Site Distribution across the country (2020)',
            type: 'map',
            map: 'world',
            roam: true,
            label: {
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                areaColor: this.bubbleTheme.areaColor,
                borderColor: this.bubbleTheme.areaBorderColor,
              },
              emphasis: {
                areaColor: this.bubbleTheme.areaHoverColor,
              },
            },
            zoom: 4,
            // center: this.latlong.Nai,

          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: this.mapData.map(itemOpt => {
                return {
                  name: itemOpt.name,
                  // name: itemOpt.name,
                  value: [
                    this.latlong[itemOpt.code].longitude,
                    this.latlong[itemOpt.code].latitude,
                    itemOpt.value,
                  ],
                  itemStyle: {
                    normal: {
                      color: itemOpt.color,
                    },
                  },
                };
              }),
            },
          ],
        };
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private getRandomGeoColor() {
    const index = Math.round(Math.random() * this.geoColors.length);
    return this.geoColors[index];
  }
}
