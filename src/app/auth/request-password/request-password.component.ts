import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../@core/services/auth.service';

@Component({
  selector: 'ngx-request-password',
  styleUrls: ['./request-password.component.scss'],
  templateUrl: './request-password.component.html',
})
export class RequestPasswordComponent {

  submitted = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: NbToastrService,
  ) {}

  submitEmail(emailForm) {
    const formData = new FormData();

    this.submitted = true;

    formData.append('email', emailForm.email);

    this.authService.requestPassword(formData)
      .subscribe(
        (data) => {
          this.showToast(`${data.message}`, 'success');
          this.router.navigate(['/auth/reset-password']);
        },
        (error: HttpErrorResponse) => {
          this.showToast(error.error.errors, 'danger');
          this.submitted = false;
        },
      );
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hello!`, { status });
  }

}
