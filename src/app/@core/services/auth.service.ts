import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private url = environment.apiURL;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  login(username: string, password: string) {
    return this.http.post<any>(`${this.url}login`, { username, password })
      .pipe(map(user => {
        if (user && user.token) {
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true');
  }

  get isLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString());
  }

  requestPassword(formData) {
    return this.http.post<any>(`${this.url}reset_password`, formData);
  }

  resetPassword(formData) {
    return this.http.post<any>(`${this.url}password_update/`, formData);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserToken');
    localStorage.removeItem('loggedIn');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
    window.location.reload();
  }

  signout(data) {
    return this.http.put(`${this.url}logout`, data);
  }

}
