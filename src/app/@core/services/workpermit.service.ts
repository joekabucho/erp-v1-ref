import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class WorkpermitService {

  apiUrl = environment.apiURL;

  private refreshNeeded$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  get refresh$() {
    return this.refreshNeeded$;
  }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  fetchWorkpermits(items: number) {
    return this.http.get<any>(`${this.apiUrl}ptws/?limit=${items}`);
  }
  fetchWorkpermitsByTicket(items: number) {
    return this.http.get<any>(`${this.apiUrl}ptws/?ticket__id=${items}&?year=today`);
  }

  fetchOnePermit(id: number) {
    return this.http.get<any>(`${this.apiUrl}ptws/${id}/`);
  }
  fetchTickets() {
    return this.http.get<any>(`${this.apiUrl}tickets/?limit=100&offset=0`);
  }
  fetchCommunication() {
    return this.http.get<any>(`${this.apiUrl}communication_plan/?limit=100&offset=0`);
  }
  fetchScope() {
    return this.http.get<any>(`${this.apiUrl}scope/?limit=100&offset=0`);
  }

  searchPermit(name: any) {
    return this.http.get<any>(`${this.apiUrl}ptws/?search=${name}`);
  }

 createWorkpermits(formData) {
    return this.http.post(`${this.apiUrl}ptws/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editWorkpermits(id: number, formData) {
    return this.http.patch(`${this.apiUrl}ptws/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchDepartments() {
    return this.http.get<any>(`${this.apiUrl}department/?limit=50&offset=0`);
  }
  fetchPermits() {
    return this.http.get<any>(`${this.apiUrl}permits/?limit=50&offset=0`);
  }
  deleteWorkpermits(id: number) {
    return this.http.delete<void>(`${this.apiUrl}incidents/${id}`);
  }


  filterTickets(items: number, year?: any, technician?: any, officer?: any) {
    return this.http.get<any>(`${this.apiUrl}permits?limit=${items}&year=${year}&safety_officer_id=${officer}&technician_id=${technician}`);
  }

  filterByYear(items: number, year: any) {
    return this.http.get<any>(`${this.apiUrl}permits?limit=${items}&year=${year}`);
  }

  filterBYTechnician(items: number, technician?: any) {
    return this.http.get<any>(`${this.apiUrl}permits?limit=${items}&technician_id=${technician}`);
  }

  filterBySafety(items: number, officer?: any) {
    return this.http.get<any>(`${this.apiUrl}permits?limit=${items}&safety_officer_id=${officer}`);
  }

  filterDate(items: number, start?: any, end?: any) {
    return this.http.get<any>(`${this.apiUrl}permits?limit=${items}&start_date=${start}&end_date=${end}`);
  }

  filterByToday(items: number, today: any) {
    return this.http.get<any>(`${this.apiUrl}permits?limit=${items}&today=${today}`);
  }

  // Error handling
  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
