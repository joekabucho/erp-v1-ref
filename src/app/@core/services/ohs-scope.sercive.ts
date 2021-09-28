import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class ScopeService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }

    fetchScope(items: number) {
        return this._http.get<any>(`${this.apiUrl}scope/?limit=${items}`);
    }
    fetchOneScope(id: number) {
        return this._http.get<any>(`${this.apiUrl}scope/${id}/`);
    }

  fetchTeams() {
    return this._http.get<any>(`${this.apiUrl}team/`);
  }
  fetchDivisions() {
    return this._http.get<any>(`${this.apiUrl}division/`);
  }
    createScope(formData) {
        return this._http.post(`${this.apiUrl}scope/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
  createDepartment(formData) {
    return this._http.post(`${this.apiUrl}department/`, formData)
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


}
