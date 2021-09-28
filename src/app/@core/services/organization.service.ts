import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class OrganizationService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }


    createCompany(formData) {
        return this._http.post(`${this.apiUrl}company/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchCompany() {
        return this._http.get<any>(`${this.apiUrl}company/`);
    }


    createDivision(formData) {
        return this._http.post(`${this.apiUrl}division/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchDivision() {
        return this._http.get<any>(`${this.apiUrl}division/`);
    }


    createDepartment(formData) {
        return this._http.post(`${this.apiUrl}department/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchDepartment() {
        return this._http.get<any>(`${this.apiUrl}department/`);
    }
    fetchSomeDepartments(items: number) {
        return this._http.get<any>(`${this.apiUrl}department/?limit=${items}`);
    }
    editDepartment(id: number, formData) {
        return this._http.put(`${this.apiUrl}department/${id}/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }


    createTeam(formData) {
        return this._http.post(`${this.apiUrl}team/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchTeam() {
        return this._http.get<any>(`${this.apiUrl}team/`);
    }
    fetchSelectTeams(id: number) {
        return this._http.get<any>(`${this.apiUrl}team/?sites__id=${id}`);
    }
    fetchOneTeam(id: number) {
        return this._http.get<any>(`${this.apiUrl}team/${id}/`);
    }

}
