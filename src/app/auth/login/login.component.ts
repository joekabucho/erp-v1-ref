import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../../@core/services/auth.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'ngx-login',
  templateUrl: './login-refactor.component.html',
  styleUrls: ['./login-refactor.component.scss'],
})

export class LoginComponent implements OnInit {

  currentTheme = 'dark';
  loginForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  loginError: any;
  errorMessage: string;
  decodeToken;

  // public togglePassword = 'password';
  public showPasswordIcon;
  public hidePasswordIcon;

  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/pages']);
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.showPasswordIcon = false;
    this.hidePasswordIcon = true;
    // this.togglePassword = 'password';



  }

  // conveniently get the values from the form fields
  get form() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.form.username.value, this.form.password.value)
      .pipe(first()).subscribe(
        user => {
          this.authService.setLoggedIn(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('currentUserToken', user.user.token);
          this.decodeToken = jwt_decode(user.user.token);

          if (this.decodeToken.role === 'SUPERUSER') {
            this.router.navigate(['/welcome']);
          } else if (this.decodeToken.role === 'ADMIN') {
            this.router.navigate(['/pages/dashboard']);
          } else if (this.decodeToken.role === 'PROJECT MANAGER') {
            this.router.navigate(['operations/projects/2']);
          } else {
            this.router.navigate(['/welcome']);
          }
        },

        error => {
          this.loginError = error;
          this.errorMessage = 'Username or Password maybe Incorrect';
          this.loading = false;
        },
      );
  }

  // Password Toggle Functions
  // showPassword() {
  //   this.showPasswordIcon = true;
  //   this.hidePasswordIcon = false;
  //   this.togglePassword = 'text';
  // }

  // hidePassword() {
  //   this.showPasswordIcon = false;
  //   this.hidePasswordIcon = true;
  //   this.togglePassword = 'password';
  // }





  togglePassword() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

}
