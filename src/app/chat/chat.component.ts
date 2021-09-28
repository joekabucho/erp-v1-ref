import { Component } from '@angular/core';
import { MENU_ITEMS } from './chat.menu';

@Component({
  selector: 'ngx-chats',
  template: `
  <ngx-one-column-layout>
    <nb-menu [items]="menu"></nb-menu>
    <router-outlet></router-outlet>
  </ngx-one-column-layout>

  `,
})
export class ChatComponent {
    menu = MENU_ITEMS;
}
