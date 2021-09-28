import { Component, OnInit } from '@angular/core';
import { OHSMENU_ITEMS } from './ohs-menu';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'ngx-ohs',
  template: `
  <ngx-two-columns-layout>
    <nb-menu [items]="menu"></nb-menu>
    <router-outlet></router-outlet>
  </ngx-two-columns-layout>
  `,
})
export class OhsComponent implements OnInit {

  menu = OHSMENU_ITEMS;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;

  constructor() {
    this.loggedInUser = jwt_decode(this.userToken);
  }


  ngOnInit() {
    if (this.loggedInUser.role_name === 'SUPERUSER' || this.loggedInUser.role_name === 'SUPERADMIN') {
      return;
    } else if (this.loggedInUser.role_name === 'SAFETY OFFICER' || this.loggedInUser.role_name === 'HEAD OF SAFETY') {
      return;
    } else if (this.loggedInUser.role_name === 'TECHNICIAN') {
      this.menu.splice(0, 1);
      this.menu.splice(2, 1);
      this.menu.splice(2, 1);
    } else {
      return;
    }
  }


}
