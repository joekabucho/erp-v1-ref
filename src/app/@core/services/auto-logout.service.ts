import { Injectable, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as store from 'store';
// import * as jwt_decode from 'jwt-decode';

const MINUTES_UNTIL_AUTO_LOGOUT = 30; // in Minutes
const CHECK_INTERVAL = 1000; // in ms
const STORE_KEY = 'lastAction';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {

  // userToken = localStorage.getItem('currentUserToken');
  // loggedInUser;

  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
  ) {
    // this.loggedInUser = jwt_decode(this.userToken);

    this.check();
    this.initInterval();
    this.initListener();

  }

  get lastAction() {
    return parseInt(store.get(STORE_KEY), 10);
  }

  set lastAction(value) {
    store.set(STORE_KEY, value);
  }

  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.reset());
    });
  }

  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, CHECK_INTERVAL);
    });
  }

  reset() {
    this.lastAction = Date.now();
  }

  check() {
    const now = Date.now();
    const timeleft = this.lastAction + MINUTES_UNTIL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    this.ngZone.run(() => {
      if (isTimeout && this.authService.isLoggedIn) {
        // this.authService.signout(this.loggedInUser.session_id)
        //   .subscribe(
        //     () => { },
        //   );
        this.authService.logout();
        // console.log(`You were automatically logged out after ${MINUTES_UNTIL_AUTO_LOGOUT} minutes of inactivity`);
      }
    });
  }
}
