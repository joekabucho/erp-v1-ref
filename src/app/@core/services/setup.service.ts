import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class SetupService {


  apiUrl = environment.apiURL;

  private refreshNeeded$ = new Subject<void>();

  constructor(private _http: HttpClient) { }

  get refresh$() {
    return this.refreshNeeded$;
  }

  fetchCertificate(items: number) {
    return this._http.get<any>(`${this.apiUrl}certificate_name/?limit=${items}`);
  }
  fetchOneCertificate(id: number) {
    return this._http.get<any>(`${this.apiUrl}certificate_name/${id}/`);
  }
  createCertificate(formData) {
    return this._http.post(`${this.apiUrl}certificate_name/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editCertificate(id: number, formData) {
    return this._http.patch(`${this.apiUrl}certificate_name/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteCertificate(id: number) {
    return this._http.delete<void>(`${this.apiUrl}certificate_name/${id}`);
  }




  // Departments
  fetchDepartments(items: number) {
    return this._http.get<any>(`${this.apiUrl}department/?limit=${items}`);
  }
  fetchOneDepartment(id: number) {
    return this._http.get<any>(`${this.apiUrl}department/${id}/`);
  }
  createDepartment(formData) {
    return this._http.post(`${this.apiUrl}department/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editDepartment(id: number, formData) {
    return this._http.patch(`${this.apiUrl}department/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteDepartment(id: number) {
    return this._http.delete<void>(`${this.apiUrl}department/${id}`);
  }

  // PPEs
  fetchPPE(items: number) {
    return this._http.get<any>(`${this.apiUrl}ppe_names/?limit=${items}`);
  }
  fetchOnePPE(id: number) {
    return this._http.get<any>(`${this.apiUrl}ppe_names/${id}/`);
  }
  createPPE(formData) {
    return this._http.post(`${this.apiUrl}ppe_names/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editPPE(id: number, formData) {
    return this._http.patch(`${this.apiUrl}ppe_names/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deletePPE(id: number) {
    return this._http.delete<void>(`${this.apiUrl}ppe_names/${id}`);
  }


  createSite(formData) {
    return this._http.post(`${this.apiUrl}site_names/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  // Attendees
  fetchAttendees(items: number) {
    return this._http.get<any>(`${this.apiUrl}attendees/?limit=${items}`);
  }
  fetchOneAttendee(id: number) {
    return this._http.get<any>(`${this.apiUrl}attendees/${id}/`);
  }
  createAttendees(formData) {
    return this._http.post(`${this.apiUrl}attendees/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editAttendees(id: number, formData) {
    return this._http.patch(`${this.apiUrl}attendees/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteAttendees(id: number) {
    return this._http.delete<void>(`${this.apiUrl}attendees/${id}`);
  }

  // Site names
  fetchSiteNames(items: number) {
    return this._http.get<any>(`${this.apiUrl}site_names/?limit=${items}`);
  }
  fetchOneSiteNames(id: number) {
    return this._http.get<any>(`${this.apiUrl}site_names/${id}/`);
  }

  deleteSiteNames(id: number) {
    return this._http.delete<void>(`${this.apiUrl}site_names/${id}/`);
  }

  editSites(id: number, formData) {
    return this._http.patch(`${this.apiUrl}site_names/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  fetchTeams() {
    return this._http.get<any>(`${this.apiUrl}team/`);
  }
  fetchHazards(items: number) {
    return this._http.get<any>(`${this.apiUrl}job_hazard/?limit=${items}`);
    // return this._http.get<any>(`${this.apiUrl}job_hazard/`);
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

  fetchScope(items: number) {
    return this._http.get<any>(`${this.apiUrl}scope/?limit=${items}`);
  }
  fetchOneScope(id: number) {
    return this._http.get<any>(`${this.apiUrl}scope/${id}/`);
  }
  createScope(formData) {
    return this._http.post(`${this.apiUrl}scope/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  editScope(id: number, formData) {
    return this._http.patch(`${this.apiUrl}scope/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteScope(id: number) {
    return this._http.delete<void>(`${this.apiUrl}scope/${id}`);
  }
  // location
  fetchLocation(items: number) {
    return this._http.get<any>(`${this.apiUrl}location/?limit=${items}`);
  }
  fetchOneLocation(id: number) {
    return this._http.get<any>(`${this.apiUrl}location/${id}/`);
  }
  createLocation(formData) {
    return this._http.post(`${this.apiUrl}location/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  editLocation(id: number, formData) {
    return this._http.patch(`${this.apiUrl}location/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteLocation(id: number) {
    return this._http.delete<void>(`${this.apiUrl}location/${id}`);
  }

  fetchSiteSSE(items: number) {
    return this._http.get<any>(`${this.apiUrl}sse_names/?limit=${items}`);
  }

  fetchDivisions() {
    return this._http.get<any>(`${this.apiUrl}division/`);
  }
  fetchOneSiteSSE(id: number) {
    return this._http.get<any>(`${this.apiUrl}sse_names/${id}/`);
  }
  createSiteSSE(formData) {
    return this._http.post(`${this.apiUrl}sse_names/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editSiteSSE(id: number, formData) {
    return this._http.patch(`${this.apiUrl}sse_names/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteSiteSSE(id: number) {
    return this._http.delete<void>(`${this.apiUrl}sse_names/${id}`);
  }
}
