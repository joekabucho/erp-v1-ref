import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardOhsService {
  apiUrl = environment.apiURL;

  constructor(private _http: HttpClient) {
  }


  fetchPTWReport() {
    return this._http.get<any>(`${this.apiUrl}ohs_ptws_report`);
  }

  fetchTicketReport() {
    return this._http.get<any>(`${this.apiUrl}ohs_tickets_report`);
  }

  fetchPTWApprovals(safety_officer: String, technician: String, start_date: String, end_date: String) {
    return this._http.get<any>(`${this.apiUrl}safetyofficerptwapprovals?safety_officer_id=${safety_officer}&technician_id=${technician}&start_date=${start_date}&end_date=${end_date}`);
  }
  fetchTicketComparisonReport() {
    return this._http.get<any>(`${this.apiUrl}ticketsreport`);
  }

  fetchPTWMonthlyReport() {
    return this._http.get<any>(`${this.apiUrl}ohs_reports`);
  }


  fetchTicketApprovals(safety_officer: String, technician: String, start_date: String, end_date: String) {
    const query = this._http.get<any>(`${this.apiUrl}safetyofficerticketapprovals?safety_officer_id=${safety_officer}&technician_id=${technician}&start_date=${start_date}&end_date=${end_date}`);
    // console.log('so' + safety_officer, 'T' + technician);
    return query;
  }

}
