import { Component } from '@angular/core';
import { MENU_ITEMS } from './casual.menu';

@Component({
  selector: 'ngx-casual',
  template: `
  <ngx-one-column-layout>
    <nb-menu [items]="menu"></nb-menu>
    <router-outlet></router-outlet>
  </ngx-one-column-layout>

  `,
})
export class CasualComponent {
    menu = MENU_ITEMS;
}
