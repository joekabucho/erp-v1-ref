import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class SiteService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }

    createSite(formData) {
        return this._http.post(`${this.apiUrl}sites/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchSite() {
        return this._http.get<any>(`${this.apiUrl}sites/?limit=1000&offset=0`);
    }
  fetchTeams() {
    return this._http.get<any>(`${this.apiUrl}team/?limit=100&offset=0`);
  }
    fetchSpecificSites(project: number) {
        return this._http.get<any>(`${this.apiUrl}sites/?project__id=${project}`);
    }
    fetchOneSite(id: number) {
        return this._http.get<any>(`${this.apiUrl}sites/${id}/`);
    }
    editSite(id: number, formData) {
        return this._http.patch(`${this.apiUrl}sites/${id}/`, formData)
        .pipe(tap(() => {
            this.refreshNeeded$.next();
        }));
    }

    deleteSite(id: number) {
      return this._http.delete<void>(`${this.apiUrl}sites/${id}`);
    }


    createLocation(formData) {
        return this._http.post(`${this.apiUrl}location/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchLocations() {
        return this._http.get<any>(`${this.apiUrl}location/?limit=100&offset=0`);
    }

}
