import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class KpiService {

  apiUrl = environment.apiURL;

  private refreshNeeded$ = new Subject<void>();

  constructor(private _http: HttpClient) { }

  get refresh$() {
    return this.refreshNeeded$;
  }

  createKPI(formData) {
    return this._http.post(`${this.apiUrl}servicekpis/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchServiceKPI() {
    return this._http.get<any>(`${this.apiUrl}servicekpis/?limit=100&offset=0`);
  }
  fetchSpecificKPI(project: number) {
    return this._http.get<any>(`${this.apiUrl}servicekpis/?project__id=${project}`);
  }
  fetchOneServiceKpi(id: number) {
    return this._http.get<any>(`${this.apiUrl}servicekpis/${id}/`);
  }

}
