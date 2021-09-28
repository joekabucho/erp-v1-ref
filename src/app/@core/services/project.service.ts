import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class ProjectService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }


    createProject(formData) {
        return this._http.post(`${this.apiUrl}projects/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchProject() {
        return this._http.get<any>(`${this.apiUrl}projects/?limit=50&offset=0`);
        // return this._http.get<any>(`${this.apiUrl}projects/`);
    }
    fetchOneProject(id: number) {
        return this._http.get<any>(`${this.apiUrl}projects/${id}/`);
    }
    editProject(id: number, formData) {
        return this._http.patch(`${this.apiUrl}projects/${id}/`, formData)
        .pipe(tap(() => {
            this.refreshNeeded$.next();
        }));
    }
    deleteProject(id: number) {
        return this._http.delete<void>(`${this.apiUrl}projects/${id}`);
    }


    createService(formData) {
        return this._http.post(`${this.apiUrl}services/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchService() {
        return this._http.get<any>(`${this.apiUrl}services/`);
    }
    deleteService(id: number) {
        return this._http.delete<void>(`${this.apiUrl}services/${id}`);
    }

    editService(id: number, formData) {
        return this._http.patch(`${this.apiUrl}services/${id}/`, formData)
        .pipe(tap(() => {
            this.refreshNeeded$.next();
        }));
    }

    createServiceKpi(formData) {
        return this._http.post(`${this.apiUrl}servicekpis/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchServiceKpi() {
        return this._http.get<any>(`${this.apiUrl}servicekpis/`);
    }



    createClient(formData) {
        return this._http.post(`${this.apiUrl}clients/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchClient() {
        return this._http.get<any>(`${this.apiUrl}clients/`);
    }
    deleteClient(id: number) {
        return this._http.delete<void>(`${this.apiUrl}clients/${id}`);
    }

}
