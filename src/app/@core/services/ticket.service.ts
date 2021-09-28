import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class TicketService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }

    fetchTickets(items: number) {
        return this._http.get<any>(`${this.apiUrl}tickets/?limit=${items}`);
    }
    fetchOneTicket(id: number) {
        return this._http.get<any>(`${this.apiUrl}tickets/${id}/`);
    }
    editTicket(id: number, formData) {
        return this._http.patch(`${this.apiUrl}tickets/${id}/`, formData)
        .pipe(tap(() => {
            this.refreshNeeded$.next();
        }));
    }
    searchTicket(name: any) {
      return this._http.get<any>(`${this.apiUrl}tickets/?search=${name}`);
    }


    filterTickets(items: number, year?: any, technician?: any, officer?: any) {
      return this._http.get<any>(`${this.apiUrl}tickets?limit=${items}&year=${year}&safety_officer_id=${officer}&technician_id=${technician}`);
    }

    filterByYear(items: number, year: any) {
      return this._http.get<any>(`${this.apiUrl}tickets?limit=${items}&year=${year}`);
    }

    filterBYTechnician(items: number, technician?: any) {
      return this._http.get<any>(`${this.apiUrl}tickets?limit=${items}&technician_id=${technician}`);
    }

    filterBySafety(items: number, officer?: any) {
      return this._http.get<any>(`${this.apiUrl}tickets?limit=${items}&safety_officer_id=${officer}`);
    }

    filterDate(items: number, start?: any, end?: any) {
      return this._http.get<any>(`${this.apiUrl}tickets?limit=${items}&start_date=${start}&end_date=${end}`);
    }

    filterByToday(items: number, today: any) {
      return this._http.get<any>(`${this.apiUrl}tickets?limit=${items}&today=${today}`);
    }

}
