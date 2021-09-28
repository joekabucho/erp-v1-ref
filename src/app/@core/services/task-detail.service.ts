import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class TaskDetailService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }

    createComment(formData) {
        return this._http.post(`${this.apiUrl}comments/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchComment() {
        return this._http.get<any>(`${this.apiUrl}comments/?limit=100&offset=0`);
    }
    fetchOneComment(id: number) {
        return this._http.get<any>(`${this.apiUrl}comments/${id}/`);
    }
    editComment(id: number, formData) {
        return this._http.patch(`${this.apiUrl}comments/${id}/`, formData)
        .pipe(tap(() => {
            this.refreshNeeded$.next();
        }));
    }
    fetchTaskComment(task: number) {
        return this._http.get<any>(`${this.apiUrl}comments/?task__id=${task}`);
    }
    fetchSubtaskComment(subtask: number) {
        return this._http.get<any>(`${this.apiUrl}comments/?subtask__id=${subtask}`);
    }



    createNumberInput(formData) {
        return this._http.post(`${this.apiUrl}input_numbers/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchNumberInput() {
        return this._http.get<any>(`${this.apiUrl}input_numbers/?limit=100&offset=0`);
    }
    fetchOneNumberInput(id: number) {
        return this._http.get<any>(`${this.apiUrl}input_numbers/${id}/`);
    }
    editNumberInput(id: number, formData) {
        return this._http.patch(`${this.apiUrl}input_numbers/${id}/`, formData)
        .pipe(tap(() => {
            this.refreshNeeded$.next();
        }));
    }

    createMetrics(formData) {
        return this._http.post(`${this.apiUrl}metrics/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchMetrics() {
        return this._http.get<any>(`${this.apiUrl}metrics/`);
    }


    createFieldName(formData) {
        return this._http.post(`${this.apiUrl}field_names/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchFieldName() {
        return this._http.get<any>(`${this.apiUrl}field_names/`);
    }



}
