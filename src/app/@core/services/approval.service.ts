import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class ApprovalService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }

    fetchApprovals(items: number) {
        return this._http.get<any>(`${this.apiUrl}approvals/?limit=${items}`);
        // return this._http.get<any>(`${this.apiUrl}approvals/`);
    }
    fetchOneApproval(id: number) {
        return this._http.get<any>(`${this.apiUrl}approvals/${id}/`);
    }
    createApproval(formData) {
        return this._http.post(`${this.apiUrl}approvals/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    editApproval(id: number, formData) {
        return this._http.patch(`${this.apiUrl}approvals/${id}/`, formData)
        .pipe(tap(() => {
            this.refreshNeeded$.next();
        }));
    }
    deleteApproval(id: number) {
        return this._http.delete<void>(`${this.apiUrl}approvals/${id}`);
    }



}
