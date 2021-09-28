import { Component } from '@angular/core';
import { ADMINMENU_ITEMS } from './admin-menu';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'ngx-admin',
  template: `
  <ngx-one-column-layout>
    <nb-menu [items]="menu"></nb-menu>
    <router-outlet></router-outlet>
  </ngx-one-column-layout>
  `,
})
export class AdminComponent {

  menu = ADMINMENU_ITEMS;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser;

  constructor() {
    this.loggedInUser = jwt_decode(this.userToken);
    // console.log(this.loggedInUser);
    // console.log(this.menu);

    if (this.loggedInUser.role === 'SUPERUSER' || this.loggedInUser.role_name === 'SUPERADMIN') {
    } else {
      this.menu[0].children.splice(2);
      this.menu.splice(1);
    }
  }



}
