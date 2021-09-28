import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbThemeService } from '@nebular/theme';


@Component({
  selector: 'ngx-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
    <!-- <nb-layout>
      <nb-layout-column>



          <nb-card>
            <nb-card-header> -->
              <!-- <nav class="navigation">
                <a href="#" (click)="back()" class="link back-link" aria-label="Back">
                  <nb-icon icon="arrow-back"></nb-icon>
                </a>
                <img src="assets/adrian-images/adrianlogo-{{currentTheme}}.png" alt="logo">
              </nav> -->
            <!-- </nb-card-header>
            <nb-card-body>
              <ngx-auth-block>
                <router-outlet></router-outlet>
              </ngx-auth-block>
            </nb-card-body>
          </nb-card>

      </nb-layout-column>
    </nb-layout> -->
    <!-- <nb-layout> -->
      <ngx-auth-block>
          <router-outlet></router-outlet>
      </ngx-auth-block>
    <!-- </nb-layout> -->

  `,
})
export class AuthComponent implements OnInit, OnDestroy {

  // <div class="auth-section">
  // <div class="trapezium">
  //   <img class="welcome-logo" src="assets/adrian-images/erp.jpg" alt="logo">
  // </div>
  // </div>

  // <div class="welcome-text">ADRIAN RESOURCE PLANNING</div>
  // <img src="assets/adrian-images/login.png" alt="logo">
  // <img src="assets/adrian-images/adrianlogo-{{currentTheme}}.png" alt="logo">
  currentTheme = 'default';

  private destroy$: Subject<void> = new Subject<void>();


  constructor(protected location: Location, private themeService: NbThemeService ) { }

  back() {
    this.location.back();
    return false;
  }

  ngOnInit() {
    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
