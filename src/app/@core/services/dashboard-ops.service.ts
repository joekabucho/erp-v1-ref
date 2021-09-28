import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardOpsService {
  apiUrl = environment.apiURL;

  constructor(private _http: HttpClient) {
  }

  fetchTaskStatus() {
    return this._http.get<any>(`${this.apiUrl}taskstatus`);
  }
  fetchTaskAdditionTrends() {
    return this._http.get<any>(`${this.apiUrl}monthlytasks`);
  }
  fetchTaskDistributionPerTeam() {
    return this._http.get<any>(`${this.apiUrl}teamtasks`);
  }
}
