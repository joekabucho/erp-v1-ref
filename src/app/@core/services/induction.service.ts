import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class InductionService {

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

  fetchSafetyInductions(items: number) {
    return this.http.get<any>(`${this.apiUrl}safetyinductions/?limit=${items}`);
  }
  fetchSafetyInductionsByTicket(items: number) {
    return this.http.get<any>(`${this.apiUrl}safetyinductions/?ticket__id=${items}&?year=today`);
  }
  fetchLocations() {
    return this.http.get<any>(`${this.apiUrl}location/?limit=50&offset=0`);
  }
  fetchSites() {
    return this.http.get<any>(`${this.apiUrl}sites/?limit=100&offset=0`);
  }
  fetchAttendees() {
    return this.http.get<any>(`${this.apiUrl}attendees/?limit=100&offset=0`);
  }
  fetchTickets() {
    return this.http.get<any>(`${this.apiUrl}tickets/?limit=50&offset=0`);
  }
  fetchUsers() {
    return this.http.get<any>(`${this.apiUrl}users/?limit=100&offset=0`);
  }
  createSafetyInductions(formData) {
    return this.http.post(`${this.apiUrl}safetyinductions/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  searchSafetyInduction(name: any) {
    return this.http.get<any>(`${this.apiUrl}safetyinductions/?search=${name}`);
  }

  createAttendants(formData) {
    return this.http.post(`${this.apiUrl}attendees/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editSafetyInductions(id: number, formData) {
    return this.http.patch(`${this.apiUrl}safetyinductions/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteSafetyInductions(id: number) {
    return this.http.delete<void>(`${this.apiUrl}safetyinductions/${id}`);
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
