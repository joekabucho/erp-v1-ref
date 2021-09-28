import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { ProgressInfo, StatsProgressBarData } from '../data/stats-progress-bar';

@Injectable()
export class StatsProgressBarService extends StatsProgressBarData {
  private progressInfoData: ProgressInfo[] = [
    {
      title: 'Sites in progress',
      value: 11,
      activeProgress: 55,
      description: 'Works in progress (55%)',
    },
    {
      title: 'Completed sites',
      value: 9,
      activeProgress: 45,
      description: 'Works done (45%)',
    },
    {
      title: 'Income',
      value: 57290000,
      activeProgress: 70,
      description: '(70%) of initially stated expectation',
    },
  ];

  getProgressInfoData(): Observable<ProgressInfo[]> {
    return observableOf(this.progressInfoData);
  }
}
