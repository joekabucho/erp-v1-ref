import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class ToolboxService {

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

  fetchToolboxTalks(items: number) {
    return this.http.get<any>(`${this.apiUrl}tbts/?limit=${items}`);
  }

  fetchToolboxTalksByTicket(items: number) {
    return this.http.get<any>(`${this.apiUrl}tbts/?ticket__id=${items}&?year=today`);
  }
  fetchDepartments() {
    return this.http.get<any>(`${this.apiUrl}department/?limit=50&offset=0`);
  }
  fetchTickets() {
    return this.http.get<any>(`${this.apiUrl}tickets/?limit=50&offset=0`);
  }
  fetchUsers() {
    return this.http.get<any>(`${this.apiUrl}users/?limit=100&offset=0`);
  }
  fetchSites() {
    return this.http.get<any>(`${this.apiUrl}sites/?limit=100&offset=0`);
  }
  fetchAttendees() {
    return this.http.get<any>(`${this.apiUrl}attendees/?limit=100&offset=0`);
  }
  searchToolbox(name: any) {
    return this.http.get<any>(`${this.apiUrl}tbts/?search=${name}`);
  }

 createToolboxTalk(formData) {
    return this.http.post(`${this.apiUrl}tbts/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  createAttendants(formData) {
    return this.http.post(`${this.apiUrl}attendees/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editToolboxTalk(id: number, formData) {
    return this.http.patch(`${this.apiUrl}tbts/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteToolboxTalk(id: number) {
    return this.http.delete<void>(`${this.apiUrl}tbts/${id}`);
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
