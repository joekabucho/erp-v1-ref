import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class HazardService {

  apiUrl = environment.apiURL;

  private refreshNeeded$ = new Subject<void>();

  constructor(private _http: HttpClient) { }

  get refresh$() {
    return this.refreshNeeded$;
  }

  fetchHazards(items: number) {
    return this._http.get<any>(`${this.apiUrl}job_hazard/?limit=${items}`);
    // return this._http.get<any>(`${this.apiUrl}job_hazard/`);
  }

  searchHazards(name: any) {
    return this._http.get<any>(`${this.apiUrl}job_hazard/?search=${name}`);
  }

  fetchOneHazard(id: number) {
    return this._http.get<any>(`${this.apiUrl}job_hazard/${id}/`);
  }
  createHazard(formData) {
    return this._http.post(`${this.apiUrl}job_hazard/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editHazard(id: number, formData) {
    return this._http.patch(`${this.apiUrl}job_hazard/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteHazard(id: number) {
    return this._http.delete<void>(`${this.apiUrl}job_hazard/${id}`);
  }

  fetchTickets() {
    return this._http.get<any>(`${this.apiUrl}tickets/?limit=50&offset=0`);
  }

  fetchAttendees() {
    return this._http.get<any>(`${this.apiUrl}attendees/?limit=50&offset=0`);
  }

  createAttendants(formData) {
    return this._http.post(`${this.apiUrl}attendees/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  searchHazardAnalysis(name: any) {
    return this._http.get<any>(`${this.apiUrl}job_hazard_analysis/?search=${name}`);
  }
  fetchHazardAnalysis(items: number) {
    return this._http.get<any>(`${this.apiUrl}job_hazard_analysis/?limit=${items}`);
  }
  getHazardAnalysis() {
    return this._http.get<any>(`${this.apiUrl}job_hazard_analysis/?limit=1000`);
  }
  fetchOneHazardAnalysis(id: number) {
    return this._http.get<any>(`${this.apiUrl}job_hazard_analysis/${id}/`);
  }
  fetchHazardAnalysisByTicket(id: number) {
    return this._http.get<any>(`${this.apiUrl}job_hazard_analysis/?ticket__id=${id}&?year=today`);
  }
  createHazardAnalysis(formData) {
    return this._http.post(`${this.apiUrl}job_hazard_analysis/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editHazardAnalysis(id: number, formData) {
    return this._http.patch(`${this.apiUrl}job_hazard_analysis/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteHazardAnalysis(id: number) {
    return this._http.delete<void>(`${this.apiUrl}job_hazard_analysis/${id}`);
  }

}
