import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class SiteInspectionService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }

    fetchSiteInspection(items: number) {
        return this._http.get<any>(`${this.apiUrl}site_inspection/?limit=${items}`);
    }
    searchSiteInspection(name: any) {
      return this._http.get<any>(`${this.apiUrl}site_inspection/?search=${name}`);
    }
    fetchOneSiteInspection(id: number) {
        return this._http.get<any>(`${this.apiUrl}site_inspection/${id}/`);
    }
    createSiteInspection(formData) {
        return this._http.post(`${this.apiUrl}site_inspection/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }


    editSiteInspection(id: number, formData) {
        return this._http.patch(`${this.apiUrl}site_inspection/${id}/`, formData)
        .pipe(tap(() => {
            this.refreshNeeded$.next();
        }));
    }

    deleteSiteInspection(id: number) {
        return this._http.delete<void>(`${this.apiUrl}site_inspection/${id}`);
    }

    fetchSites() {
      return this._http.get<any>(`${this.apiUrl}site_names/?limit=100&offset=0`);
    }

}
