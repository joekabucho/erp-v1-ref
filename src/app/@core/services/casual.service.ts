import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CasualService {

  apiUrl = environment.apiURL;

  private refreshNeeded$ = new Subject<void>();

  constructor(private _http: HttpClient) { }

  get refresh$() {
    return this.refreshNeeded$;
  }


  fetchCasuals(items: number) {
    return this._http.get<any>(`${this.apiUrl}casuals/?limit=${items}`);
  }
  fetchOneCasual(id: number) {
    return this._http.get<any>(`${this.apiUrl}casuals/${id}/`);
  }
  createCasual(formData) {
    return this._http.post(`${this.apiUrl}casuals/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editCasual(id: number, formData) {
    return this._http.patch(`${this.apiUrl}casuals/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteCasual(id: number) {
    return this._http.delete<void>(`${this.apiUrl}casuals/${id}`);
  }



  fetchCasualReport(items: number) {
    return this._http.get<any>(`${this.apiUrl}casuals_reporting/?limit=${items}/`);
  }
  fetchOneCasualReport(id: number) {
    return this._http.get<any>(`${this.apiUrl}casuals_reporting/${id}/`);
  }
  createCasualReport(formData) {
    return this._http.post(`${this.apiUrl}casuals_reporting/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editCasualReport(id: number, formData) {
    return this._http.patch(`${this.apiUrl}casuals_reporting/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteCasuaReport(id: number) {
    return this._http.delete<void>(`${this.apiUrl}casuals_reporting/${id}`);
  }


  fetchCasualDate(items: number) {
    return this._http.get<any>(`${this.apiUrl}casual_report_dates/?limit=${items}/`);
  }


  fetchOneCasualDate(id: number) {
    return this._http.get<any>(`${this.apiUrl}casual_report_dates/${id}/`);
  }
  createCasualDate(formData) {
    return this._http.post(`${this.apiUrl}casual_report_dates/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editCasualDate(id: number, formData) {
    return this._http.patch(`${this.apiUrl}casual_report_dates/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteCasualDate(id: number) {
    return this._http.delete<void>(`${this.apiUrl}casual_report_dates/${id}`);
  }


  fetchWeeklyReport(id: number) {
    return this._http.get<any>(`${this.apiUrl}casuals_aggregated_weekly_report?limit=1000000&week=${id}`);
  }
  fetchCasualWeeklyReport() {
    return this._http.get<any>(`${this.apiUrl}casual_weekly_report`);
  }
  fetchCasualAggregatedReport() {
    return this._http.get<any>(`${this.apiUrl}casuals_aggregated_weekly_report`);
  }
  fetchCasualAggregatedReportByWeek(item: number) {
    return this._http.get<any>(`${this.apiUrl}casuals_aggregated_weekly_report?week=${item}`);
  }
  filterByYear(items: number, year: any) {
    return this._http.get<any>(`${this.apiUrl}casual_weekly_report?limit=${items}&year=${year}`);
  }
  fetchOneCasualWeeklyReport(id: number) {
    return this._http.get<any>(`${this.apiUrl}casuals_reporting/?week=${id}`);
  }
  createCasualWeeklyReport(formData) {
    return this._http.post(`${this.apiUrl}casual_weekly_report/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editCasualWeeklyReport(id: number, formData) {
    return this._http.patch(`${this.apiUrl}casual_weekly_report/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteCasualWeeklyReport(id: number) {
    return this._http.delete<void>(`${this.apiUrl}casual_weekly_report/${id}`);
  }


  importCasuals(formData) {
    return this._http.post(`${this.apiUrl}casual_reports_import`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }


}
