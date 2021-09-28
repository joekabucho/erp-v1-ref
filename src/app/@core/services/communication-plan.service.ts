import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class CommunicationPlanService {

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

  fetchCommunication(items: number) {
    return this.http.get<any>(`${this.apiUrl}communication_plan/?limit=${items}`);
  }
  fetchCommunicationByTicket(items: number) {
    return this.http.get<any>(`${this.apiUrl}communication_plan/?ticket__id=${items}&?year=today`);
  }
  fetchUsers() {
    return this.http.get<any>(`${this.apiUrl}users/?limit=100&offset=0`);
  }
  fetchSites() {
    return this.http.get<any>(`${this.apiUrl}site_names/?limit=50&offset=0`);
  }
  fetchScopes() {
    return this.http.get<any>(`${this.apiUrl}scope/?limit=100&offset=0`);
  }
  createCommunication(formData) {
    return this.http.post(`${this.apiUrl}communication_plan/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  searchCommunication(name: any) {
    return this.http.get<any>(`${this.apiUrl}communication_plan/?search=${name}`);
  }


  createSite(formData) {
    return this.http.post(`${this.apiUrl}site_names/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editCommunication(id: number, formData) {
    return this.http.patch(`${this.apiUrl}communication_plan/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchLocations() {
    return this.http.get<any>(`${this.apiUrl}location/?limit=50&offset=0`);
  }
  deleteCommunication(id: number) {
    return this.http.delete<void>(`${this.apiUrl}communication_plan/${id}`);
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
