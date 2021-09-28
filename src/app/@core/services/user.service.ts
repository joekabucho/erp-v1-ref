import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
// import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  // apiUrl = environment.url;

  apiUrl = environment.apiURL;

  private refreshNeeded$ = new Subject<void>();

  constructor(private _http: HttpClient) { }

  get refresh$() {
    return this.refreshNeeded$;
  }

  createUser(formData) {
    return this._http.post(`${this.apiUrl}users/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchUsers() {
    return this._http.get<any>(`${this.apiUrl}users/?limit=1000&offset=0`);
  }

  fetchSubconUsers() {
    return this._http.get<any>(`${this.apiUrl}users/?is_subcontractor=true&limit=1000`);
  }

  fetchOneUser(id: number) {
    return this._http.get<any>(`${this.apiUrl}users/${id}`);
  }
  editUser(id: number, formData) {
    return this._http.patch(`${this.apiUrl}users/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteUser(id: number) {
    return this._http.delete<void>(`${this.apiUrl}users/${id}`);
  }

  fetchSpecificUsers(team: number) {
    return this._http.get<any>(`${this.apiUrl}users/?team__id=${team}`);
  }



  createRole(formData) {
    return this._http.post(`${this.apiUrl}role/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  createLocation(formData) {
    return this._http.post(`${this.apiUrl}location/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchRole() {
    return this._http.get<any>(`${this.apiUrl}role/?limit=100&offset=0`);
  }
  fetchLocation() {
    return this._http.get<any>(`${this.apiUrl}location/`);
  }
  deleteLocation(id: number) {
    return this._http.delete<void>(`${this.apiUrl}location/${id}`);
  }
  fetchOneRole(id: number) {
    return this._http.get<any>(`${this.apiUrl}role/${id}`);
  }
  deleteRole(id: number) {
    return this._http.delete<void>(`${this.apiUrl}role/${id}`);
  }


  createProfile(formData) {
    return this._http.post(`${this.apiUrl}profiles/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchProfiles() {
    return this._http.get<any>(`${this.apiUrl}profiles`);
  }
  fetchOneProfile(id: number) {
    return this._http.get<any>(`${this.apiUrl}profiles/${id}`);
  }
  editProfile(id: number, formData) {
    return this._http.put(`${this.apiUrl}profiles/${id}`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }


  createPermission(formData) {
    return this._http.post(`${this.apiUrl}permissionmap/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchPermissions() {
    return this._http.get<any>(`${this.apiUrl}permissionmap/`);
  }
  deletePermission(id: number) {
    return this._http.delete<void>(`${this.apiUrl}permissionmap/${id}`);
  }

  fetchContentType() {
    return this._http.get<any>(`${this.apiUrl}content_types`);
  }


  fetchUserTrail() {
    return this._http.get<any>(`${this.apiUrl}audit_trail`);
  }
  fetchUserLoginTrail() {
    return this._http.get<any>(`${this.apiUrl}login_trail`);
  }

}
