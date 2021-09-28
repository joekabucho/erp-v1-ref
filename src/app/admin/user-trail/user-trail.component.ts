import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { UserService } from '../../@core/services/user.service';
import * as jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./user-trail.component.scss'],
})
export class AuditTrailComponent implements OnInit {

  alive = true;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser;

  public headElements = [
    'ID',
    'USERNAME',
    'ACTIVITY',
    'CONTENT CHANGED',
    'TIME',
  ];

  public usersData = [];
  public searchTerm;

  page: number = 1;
  allItems: any;
  nextPage: any;
  previousPage: any;


  constructor(
    private userService: UserService,
    private toastr: NbToastrService,
    private _http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
    this.route.queryParams.subscribe(
      params => this.page = params['page'] ? params['page'] : 1,
    );
  }

  ngOnInit() {
    this.getAuditTrail();
  }

  getAuditTrail() {
    this.userService.fetchUserTrail()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.usersData = data.results;
          this.allItems = data.count;
          this.nextPage = data.next;
          this.previousPage = data.previous;
        },
      );
  }

  pageChanged(event: number) {
    this.router.navigate(['/admin/audit-trail/'], { queryParams: { page: event } });


    if (event > this.page) {
      this._http.get<any>(`${this.nextPage}`)
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          data => {
            this.usersData = data.results;
            this.nextPage = data.next;
            this.previousPage = data.previous;
          },
        );
    } else {
      this._http.get<any>(`${this.previousPage}`)
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          data => {
            this.usersData = data.results;
            this.nextPage = data.next;
            this.previousPage = data.previous;
          },
        );
    }

  }


  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

}


@Component({
  selector: 'ngx-login-trail',
  templateUrl: './login-trail.component.html',
  styleUrls: ['./user-trail.component.scss'],
})
export class LoginTrailComponent implements OnInit {

  alive = true;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser;

  public headElements = [
    'ID',
    'USERNAME',
    'SIGN IN',
    'SIGN OUT',
    'IP ADDRESSS',
  ];

  public usersData = [];
  public searchTerm;

  page: number = 1;
  allItems: any;
  nextPage: any;
  previousPage: any;

  constructor(
    private userService: UserService,
    private toastr: NbToastrService,
    private _http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
    this.route.queryParams.subscribe(
      params => this.page = params['page'] ? params['page'] : 1,
    );
  }

  ngOnInit() {
    this.getLoginTrail();
  }

  getLoginTrail() {
    this.userService.fetchUserLoginTrail()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.usersData = data.results;
          this.allItems = data.count;
          this.nextPage = data.next;
          this.previousPage = data.previous;
        },
      );
  }

  pageChanged(event: number) {
    this.router.navigate(['/admin/login-trail'], { queryParams: { page: event } });


    if (event > this.page) {
      this._http.get<any>(`${this.nextPage}`)
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          data => {
            this.usersData = data.results;
            this.nextPage = data.next;
            this.previousPage = data.previous;
          },
        );
    } else {
      this._http.get<any>(`${this.previousPage}`)
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          data => {
            this.usersData = data.results;
            this.nextPage = data.next;
            this.previousPage = data.previous;
          },
        );
    }

  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }


}
