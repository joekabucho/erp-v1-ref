import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../@core/services/auth.service';
import * as jwt_decode from 'jwt-decode';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { UserService } from '../@core/services/user.service';
import { takeWhile } from 'rxjs/operators';
import { env } from '../../../secret_env';

@Component({
  selector: 'ngx-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnDestroy {

  alive = true;
  currentTheme = 'default';
  userToken = localStorage.getItem('currentUserToken');
  userDetails;
  userRole = {
    name: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: NbToastrService,
    private userService: UserService,
  ) {
    this.userDetails = jwt_decode(this.userToken);
    if (this.userDetails.role !== 'SUPERUSER') {
      this.getUserRole();
    } else {
      this.userRole.name = 'SUPERUSER';
    }
  }

  getUserRole() {
    this.userService.fetchOneRole(this.userDetails.role)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.userRole = data;
      });
  }

  toAdmin() {
    if (this.userRole.name === 'ADMIN') {
      this.router.navigate(['/admin/smart-table']);
    } else if (this.userRole.name === 'SUPERUSER' || this.userRole.name === 'SUPERADMIN') {
      this.router.navigate(['/admin/smart-table']);
    } else {
      this.showToast('top-left', 'You dont have the authorization to access this page', 'warning');
    }
  }

  toOperations() {
    if (this.userRole.name === 'HOD') {
      this.router.navigate(['/pages/dashboard']);
    } else if (this.userRole.name === 'PROJECT MANAGER') {
      this.router.navigate(['operations/projects/2']);
    } else if (this.userRole.name === 'TECHNICIAN') {
      this.router.navigate(['/operations/tasks']);
    } else if (this.userRole.name === 'ADMIN') {
      this.router.navigate(['/pages/dashboard']);
    } else if (this.userRole.name === 'SUPERUSER' || this.userRole.name === 'SUPERADMIN') {
      this.router.navigate(['/pages/dashboard']);
    } else {
      this.showToast('top-left', 'You dont have the authorization to access this page', 'warning');
    }
  }

  toOhs() {
    if (this.userRole.name === 'PROJECT MANAGER' || this.userRole.name === 'HOD') {
      this.showToast('top-left', 'You dont have the authorization to access this page', 'warning');
    } else {
      this.router.navigate(['/ohs/job']);
    }
  }

  toCasuals() {
    if (this.userRole.name === 'TECHNICIAN' || this.userRole.name === 'SAFETY OFFICER') {
      this.showToast('top-left', 'You dont have the authorization to access this page', 'warning');
    } else {
      this.router.navigate(['/casual/report']);
    }
  }

  toTicketing() {
    localStorage.setItem('module', 'ticketing');
    window.location.href = `${env.env.WAREHOUSE_URL}/redirect`;
  }

  logout() {
    this.authService.signout(this.userDetails.session_id)
      .subscribe(
        () => { },
      );
    this.authService.logout();
  }

  showToast(position, message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { position, status });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
