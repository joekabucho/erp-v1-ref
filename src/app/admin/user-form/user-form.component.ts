import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbDialogService, NbComponentStatus } from '@nebular/theme';
import { UserService } from '../../@core/services/user.service';
import { OrganizationService } from '../../@core/services/organization.service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import { User } from '../../@core/models/user';
import { Location } from '@angular/common';
import { MustMatch } from '../../@theme/directives/must-match.validator';
import { MouseEvent } from '@agm/core';



@Component({
  selector: 'ngx-userform',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, AfterViewInit {
  @ViewChild('search', { static: true }) public searchRef: ElementRef;
  alive = true;
  userForm: FormGroup;
  showPassword = true;
  submitted = false;

  is_subcon = false;

  public checked = false;
  public show = false;

  public teams = [];
  public roles = [];
  public divisions = [];

  public teamMembers = [];
  public currentUser;

  latitude: any = [];
  longitude: any = [];
  savePlace: any;
  zoom: number;
  address: any;
  Location = [];
  company = [];
  LocDetails: any = [];

  private geoCoder;



  constructor(
    protected location: Location,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private orgService: OrganizationService,
    private toastr: NbToastrService,
    private router: Router,
    // private ngZone: NgZone,
    // private mapsAPILoader: MapsAPILoader,
    private dialogService: NbDialogService,

  ) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit() {
    this.orgService.refresh$.subscribe(
      () => {
        this.getCompany();
      },
    );
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone_number: ['254', [Validators.required, Validators.pattern('[0-9 ]{12}')]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
      user_company: [''],
      division: [''],
      team: [''],
      employee_number: [''],
      location: [''],
      // is_subcontractor: [''],
    }, {
        validator: MustMatch('password', 'confirm_password'),
      });
    this.getUser();
    this.getDivisions();
    this.getTeams();
    this.getRoles();
    this.getLocations();
    this.getCompany();
  }

  ngAfterViewInit() {
    // this.mapsAPILoader.load().then(() => {
    //   this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder;
    //
    //   const autocomplete = new google.maps.places.Autocomplete(this.searchRef.nativeElement);
    //   autocomplete.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //       this.savePlace = place.name;
    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.zoom = 12;
    //     });
    //   });
    // });
  }
  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }
  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  getUser() {
    const id = +this.route.snapshot.paramMap.get('id');

    if (id === 0) {
    } else {
      this.userService.fetchOneUser(id)
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          (user: User) => {
            this.is_subcon = user.is_subcontractor;
            setTimeout(() => {
              this.editUSer(user);
            }, 1000);
            this.currentUser = true;
          },
        );
    }
  }

  changed(event) {
    this.is_subcon = event.target.checked;
  }

  getDivisions() {
    this.orgService.fetchDivision()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.divisions = data.results;
        },
      );
  }

  getTeams() {
    this.orgService.fetchTeam()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.teams = data.results;
        },
      );
  }

  getRoles() {
    this.userService.fetchRole()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.roles = data.results;
        },
      );
  }

  getLocations() {
    this.userService.fetchLocation()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Location = data.results;
        },
      );
  }

  getCompany() {
    this.orgService.fetchCompany()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.company = data.results;
        },
      );
  }



  getInputType() {
    if (!this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  saveUser() {
    const formData = new FormData;
    const id = +this.route.snapshot.paramMap.get('id');

    this.submitted = true;


    if (this.is_subcon) {
      formData.append('first_name', this.userForm.get('first_name').value);
      formData.append('last_name', this.userForm.get('last_name').value);
      formData.append('username', this.userForm.get('username').value);
      formData.append('email', this.userForm.get('email').value);
      formData.append('phone_number', this.userForm.get('phone_number').value);
      formData.append('role', this.userForm.get('role').value);
      formData.append('location', this.userForm.get('location').value);
      formData.append('password', this.userForm.get('password').value);
      formData.append('confirm_password', this.userForm.get('confirm_password').value);
      formData.append('user_company', this.userForm.get('user_company').value);
      formData.append('is_subcontractor', this.is_subcon ? 'true' : 'false');
    } else {
      formData.append('first_name', this.userForm.get('first_name').value);
      formData.append('last_name', this.userForm.get('last_name').value);
      formData.append('username', this.userForm.get('username').value);
      formData.append('email', this.userForm.get('email').value);
      formData.append('employee_number', this.userForm.get('employee_number').value);
      formData.append('phone_number', this.userForm.get('phone_number').value);
      formData.append('team', this.userForm.get('team').value);
      formData.append('division', this.userForm.get('division').value);
      formData.append('role', this.userForm.get('role').value);
      formData.append('location', this.userForm.get('location').value);
      formData.append('password', this.userForm.get('password').value);
      formData.append('confirm_password', this.userForm.get('confirm_password').value);
    }

    if (id === 0) {
      this.userService.createUser(formData)
        .subscribe(
          (user: User) => {
            this.showToast(`You have successfully added ${user.username}`, 'success');
            if (user.is_subcontractor) {
              this.router.navigate(['/admin/subcontructor']);
            } else {
              this.router.navigate(['/admin/smart-table']);
            }
          },
          (error: HttpErrorResponse) => {
            this.showToast('Unable to create the user', 'danger');
            this.submitted = false;
          },
        );
    } else {
      this.userService.editUser(id, formData)
        .subscribe(
          (user: User) => {
            this.showToast(`You have successfully updated ${user.username}`, 'success');
            if (user.is_subcontractor) {
              this.router.navigate(['/admin/subcontructor']);
            } else {
              this.router.navigate(['/admin/smart-table']);
            }
          },
          (error: HttpErrorResponse) => {
            this.showToast(`Unable to update the User`, 'danger');
            this.submitted = false;
          },
        );
    }
  }

  editUSer(user: User) {
    this.userForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      phone_number: user.phone_number,
      employee_number: user.employee_number,
      team: user.team === null ? '' : user.team.id,
      location: user.location === null ? '' : user.location.id,
      division: user.division === null ? '' : user.division.id,
      role: user.role === null ? '' : user.role.id,
      user_company: user.user_company === null ? '' : user.user_company.id,
    });
  }

  saveCompany(compForm) {
    const formData = new FormData;
    const modalCloseBtn = document.getElementById('close-comp');

    this.submitted = true;

    formData.append('name', compForm.name);

    this.orgService.createCompany(formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a company', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }


  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  toOrgDivision() {
    this.router.navigate(['/admin/division']);
  }
  toOrgDepartment() {
    this.router.navigate(['/admin/department']);
  }
  toRoles() {
    this.router.navigate(['/admin/permission']);
  }

  saveLocation() {
    this.submitted = true;
    const payload = {
      'name': this.LocDetails,
      'latitude': this.latitude,
      'longitude': this.longitude,
    };
    const modalCloseBtn = document.getElementById('close-location');

    this.userService.createLocation(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a location', 'success');
          this.getLocations();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('Error', 'danger');
        },
      );
  }

  openLocation(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
  }

  openComp(dialog2: TemplateRef<any>) {
    this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
  }

  back() {
    this.location.back();
    return false;
  }

  placeChangedCallback(location: google.maps.places.PlaceResult) {
    this.LocDetails = location.formatted_address;
    this.latitude = location.geometry.location.lat();
    this.longitude = location.geometry.location.lng();
  }
}
