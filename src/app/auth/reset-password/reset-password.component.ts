import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { AuthService } from '../../@core/services/auth.service';

@Component({
  selector: 'ngx-reset-password',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {

  submitted = false;
  error;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: NbToastrService,
  ) {}

  submitNewPass(passForm) {
    const formData = new FormData();

    this.submitted = true;

    formData.append('password', passForm.password);
    formData.append('confirm_password', passForm.confirm_password);

    this.authService.requestPassword(formData)
      .subscribe(
        () => {
          this.showToast(`You have successfully reset your password`, 'success');
          this.router.navigate(['/auth/login']);
        },
        (error: HttpErrorResponse) => {
          this.error = error;
          this.showToast(this.error.statusText, 'danger');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
      );
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hello!`, { status });
  }
}
