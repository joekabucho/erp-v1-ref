import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-two-columns-layout',
  styleUrls: ['./two-columns.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>
      <nb-layout-column style="padding: 0;">
        <ngx-sub-header [hidden]="currentRoute === '/ohs/d3' || currentRoute === '/ohs/setup' || currentRoute === '/ohs/document'"></ngx-sub-header>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

    </nb-layout>
  `,
})
export class TwoColumnsLayoutComponent {


  currentRoute: any;

  constructor(
    private router: Router,
  ) {
    router.events.subscribe(() => {
      this.currentRoute = this.router.url.toString();
    });
  }

}
