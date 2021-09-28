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
import * as jwt_decode from 'jwt-decode';



@Component({
  selector: 'ngx-subcon',
  templateUrl: './subcon.component.html',
  styleUrls: ['./subcon.component.scss'],
})
export class SubconComponent implements OnInit, AfterViewInit {

  alive = true;
  userToken = localStorage.getItem('currentUserToken');

  loggedInUser: any;
  public noImage = null;
  public show = false;


  public headElements = [
    'ID',
    'COMPANY',
    'EMAIL',
    'PHONE. NO',
    'FIRST NAME',
    'LAST NAME',
    'ROLE',
    'EDIT',
    'REMOVE',
  ];

  public usersData = [];
  public allUsersData = [];

  public teams = [];
  public roles = [];
  public divisions = [];
  public company = [];
  public searchTerm;

  page: number = 1;



  itemsPerPage: number;

  public profilePhoto: File = null;
  public profileId;



  @ViewChild('search', { static: true }) public searchRef: ElementRef;

  userForm: FormGroup;
  showPassword = true;
  submitted = false;


  public checked = false;

  public teamMembers = [];
  public currentUser;

  latitude: any = [];
  longitude: any = [];
  savePlace: any;
  zoom: number;
  address: any;
  Location = [];
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
    private dialogService: NbDialogService,

  ) {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.loggedInUser = jwt_decode(this.userToken);
  }



  ngOnInit() {
    this.userService.refresh$.subscribe(
      () => {
        this.getUser();
        this.getCompany();
      },
    );
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone_number: ['254', [Validators.required, Validators.pattern('[0-9 ]{12}')]],
      subcon_company: ['', Validators.required],
      role: ['', Validators.required],
      location: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],

    }, {
        validator: MustMatch('password', 'confirm_password'),
      });
    this.getUser();
    this.getRoles();
    this.getLocations();
    this.getCompany();

    this.getUsers();
    this.itemsPerPage = 10;
  }

  ngAfterViewInit() {
  }



  getUsers() {
    this.userService.fetchSubconUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.usersData = data.results;
        },
      );
  }


  onChange(event: any) {
    event === null ? this.itemsPerPage = 10 : this.itemsPerPage = event;
  }



  closeToggle() {
    this.show = false;
  }

  confirmDelete(user) {
    const x = confirm('Are you sure you want to delete this user?');
    if (x) {
      this.removeUser(user);
    } else {
      return false;
    }
  }

  removeUser(user) {
    this.userService.deleteUser(user.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Deleted the User`, 'success');
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Operation unsuccessful', 'danger');
        },
      );
  }

  eidtSubcon(user) {
    this.router.navigate([`/admin/user/${user.id}`]);
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
            setTimeout(() => {
              this.editUSer(user);
            }, 1000);
            this.currentUser = true;
          },
        );
    }
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

    const modalCloseBtn = document.getElementById('close-subcon');

    this.submitted = true;

    formData.append('first_name', this.userForm.get('first_name').value);
    formData.append('last_name', this.userForm.get('last_name').value);
    formData.append('username', this.userForm.get('username').value);
    formData.append('email', this.userForm.get('email').value);
    formData.append('phone_number', this.userForm.get('phone_number').value);
    formData.append('role', this.userForm.get('role').value);
    formData.append('location', this.userForm.get('location').value);
    formData.append('password', this.userForm.get('password').value);
    formData.append('confirm_password', this.userForm.get('confirm_password').value);
    formData.append('user_company', this.userForm.get('subcon_company').value);
    formData.append('is_subcontractor', 'true');

    this.userService.createUser(formData)
    .subscribe(
      (user: User) => {
        this.showToast(`You have successfully added ${user.username}`, 'success');
        this.submitted = false;
        modalCloseBtn.click();
      },
      (error: HttpErrorResponse) => {
        this.showToast('Unable to create the user', 'danger');
        this.submitted = false;
      },
    );
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
    });
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


  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }


  addUser() {
    this.router.navigate(['/admin/user/0']);
  }

  openLocation(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
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
