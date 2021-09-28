import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class IncidentsService {

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

  fetchIncidents(items: number) {
    return this.http.get<any>(`${this.apiUrl}incidents/?limit=${items}`);
  }

  fetchIncidentsByTicket(items: number) {
    return this.http.get<any>(`${this.apiUrl}incidents/?ticket__id=${items}&?year=today`);
  }

  searchIncidents(name: any) {
    return this.http.get<any>(`${this.apiUrl}incidents/?search=${name}`);
  }

  fetchTickets() {
    return this.http.get<any>(`${this.apiUrl}tickets/?limit=100&offset=0`);
  }
  fetchUsers() {
    return this.http.get<any>(`${this.apiUrl}users/?limit=100&offset=0`);
  }
  createIncidents(formData) {
    return this.http.post(`${this.apiUrl}incidents/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editIncidents(id: number, formData) {
    return this.http.patch(`${this.apiUrl}incidents/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchDepartments() {
    return this.http.get<any>(`${this.apiUrl}department/?limit=50&offset=0`);
  }
  fetchLocations() {
    return this.http.get<any>(`${this.apiUrl}location/?limit=50&offset=0`);
  }
  deleteIncidents(id: number) {
    return this.http.delete<void>(`${this.apiUrl}incidents/${id}`);
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
