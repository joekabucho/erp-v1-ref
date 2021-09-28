import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class FileService {

    apiUrl = environment.apiURL;

    private refreshNeeded$ = new Subject<void>();

    constructor(private _http: HttpClient) { }

    get refresh$() {
        return this.refreshNeeded$;
    }

    createFile(formData) {
        return this._http.post(`${this.apiUrl}erpfiles/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchFiles() {
        return this._http.get<any>(`${this.apiUrl}erpfiles/?limit=10000&offset=0`);
    }
    fetchOneFile(id: number) {
        return this._http.get<any>(`${this.apiUrl}erpfiles/${id}/`);
    }
    deleteFile(id: number) {
        return this._http.delete<void>(`${this.apiUrl}erpfiles/${id}`);
    }




    fetchTaskFiles(task: number) {
        return this._http.get<any>(`${this.apiUrl}erpfiles/?task__id=${task}`);
    }


    fetchSubtaskFiles(subtask: number) {
        return this._http.get<any>(`${this.apiUrl}erpfiles/?subtask__id=${subtask}`);
    }


    createFileType(formData) {
        return this._http.post(`${this.apiUrl}filetypes/`, formData)
            .pipe(tap(() => {
                this.refreshNeeded$.next();
            }));
    }
    fetchFileTypes() {
        return this._http.get<any>(`${this.apiUrl}filetypes/`);
    }

    fetchBinder(n) {
      return this._http.get<any>(`${this.apiUrl}ops_project_binder?project=${n}`);
    }
}
