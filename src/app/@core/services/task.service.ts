import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TaskService {

  apiUrl = environment.apiURL;

  private refreshNeeded$ = new Subject<void>();

  constructor(private _http: HttpClient) { }

  get refresh$() {
    return this.refreshNeeded$;
  }

  createTask(formData) {
    return this._http.post(`${this.apiUrl}tasks/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  fetchTask() {
    return this._http.get<any>(`${this.apiUrl}tasks/?limit=1000&offset=0`);
  }
  fetchSpecificTasks(site: number, team: number) {
    return this._http.get<any>(`${this.apiUrl}tasks/?site__id=${site}&team__id=${team}`);
  }
  fetchSiteTasks(site: number) {
    return this._http.get<any>(`${this.apiUrl}tasks/?site__id=${site}`);
  }
  fetchTeamTasks(team: number) {
    return this._http.get<any>(`${this.apiUrl}tasks/?limit=100&team__id=${team}`);
  }
  fetchTechnicianTasks(technician: number) {
    return this._http.get<any>(`${this.apiUrl}tasks/?limit=100&assign__id=${technician}`);
  }


  fetchOneTask(id: number) {
    return this._http.get<any>(`${this.apiUrl}tasks/${id}/`);
  }
  editTask(id: number, formData) {
    return this._http.patch(`${this.apiUrl}tasks/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteTask(id: number) {
    return this._http.delete<void>(`${this.apiUrl}tasks/${id}`);
  }

  createDefaultTask(formData) {
    return this._http.post(`${this.apiUrl}default_tasks/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchDefaultTask() {
    return this._http.get<any>(`${this.apiUrl}default_tasks/`);
  }
  fetchOneDefaultTask(id: number) {
    return this._http.get<any>(`${this.apiUrl}default_tasks/${id}/`);
  }
  editDefaultTask(id: number, formData) {
    return this._http.patch(`${this.apiUrl}default_tasks/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }


  createKPI(formData) {
    return this._http.post(`${this.apiUrl}kpis/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchKPI() {
    return this._http.get<any>(`${this.apiUrl}kpis/?limit=1000&offset=0`);
  }
  fetchOneKPI(id: number) {
    return this._http.get<any>(`${this.apiUrl}kpis/${id}/`);
  }

  fetchTag() {
    return this._http.get<any>(`${this.apiUrl}tag/`);
  }



  fetchSubTask() {
    return this._http.get<any>(`${this.apiUrl}subtasks/?limit=1000&offset=0`);
  }
  fetchOneSubTask(id: number) {
    return this._http.get<any>(`${this.apiUrl}subtasks/${id}/`);
  }
  createSubTask(formData) {
    return this._http.post(`${this.apiUrl}subtasks/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editSubTask(id: number, formData) {
    return this._http.patch(`${this.apiUrl}subtasks/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteSubTask(id: number) {
    return this._http.delete<void>(`${this.apiUrl}subtasks/${id}`);
  }

  fetchSpecificsubTasks(task: number) {
    return this._http.get<any>(`${this.apiUrl}subtasks/?task__id=${task}`);
  }
}
