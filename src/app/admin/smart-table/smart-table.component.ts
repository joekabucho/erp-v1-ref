import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { UserService } from '../../@core/services/user.service';
import * as jwt_decode from 'jwt-decode';
import { OrganizationService } from '../../@core/services/organization.service';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements OnInit {

  alive = true;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser;

  public noImage = null;
  public show = false;

  public headElements = [
    'ID',
    'STAFF. NO',
    'LAST NAME',
    'FIRST NAME',
    'ROLE',
    'DIVISION',
    'TEAM',
    'PHONE. NO',
    'EDIT',
    'REMOVE',
  ];

  public usersData = [];
  public allUsersData = [];

  public teams = [];
  public roles = [];
  public divisions = [];
  public searchTerm;

  page: number = 1;

  public userProfile = {
    'id': null,
    'username': null,
    'fullname': null,
    'image': null,
    'last_seen': null,
    'online': false,
    'user': null,
    // 'userTasks': null,
  };

  itemsPerPage: number;

  public profilePhoto: File = null;
  public profileId;

  private error;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: NbToastrService,
    private orgService: OrganizationService,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
  }

  ngOnInit() {
    this.getUsers();
    this.getDivisions();
    this.getTeams();
    this.getRoles();
    this.itemsPerPage = 10;
  }

  addUser() {
    this.router.navigate(['/admin/user/0']);
  }

  getUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.usersData = data.results.filter(u => {
            return u.is_subcontractor !== true;
          });
          this.allUsersData = this.usersData;
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

  onDivisionChange(event: any) {
    if (event === null) {
      this.usersData = this.allUsersData;
    } else {
      this.usersData = this.allUsersData.filter(user => {
        if (user.division !== null) {
          return user.division.id === event;
        }
      });
    }
  }

  onTeamChange(event: any) {
    if (event === null) {
      this.usersData = this.allUsersData;
    } else {
      this.usersData = this.allUsersData.filter(user => {
        if (user.team !== null) {
          return user.team.id === event;
        }
      });
    }
  }

  onRoleChange(event: any) {
    if (event === null) {
      this.usersData = this.allUsersData;
    } else {
      this.usersData = this.allUsersData.filter(user => {
        if (user.role !== null) {
          return user.role.id === event;
        }
      });
    }
  }

  onChange(event: any) {
    event === null ? this.itemsPerPage = 10 : this.itemsPerPage = event;
  }



  toggle(user) {
    this.show = true;
    const id = user.id;

    this.userService.fetchOneProfile(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.userProfile.username = data.username;
          this.userProfile.image = data.image;
          this.userProfile.id = data.user.id;
          // this.userProfile.userTasks = data.user.tasks.length;
          this.userProfile.user = data.user;
        },
      );
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

  onProfilePhotoSelected(event) {
    this.profilePhoto = event.target.files[0] as File;
    this.updateProfile();
  }

  updateProfile() {
    const formData = new FormData();

    formData.append('image', this.profilePhoto, this.profilePhoto.name);
    formData.append('image_name', this.profilePhoto.name);

    this.userService.editProfile(this.userProfile.id, formData)
      .subscribe(() => {
        this.showToast(`You have successfully updated ${this.userProfile.username}`, 'success');
        this.show = false;
        setTimeout(() => {
          this.toggle(this.userProfile.user);
        }, 3000);
      },
        (error: HttpErrorResponse) => {
          this.error = error;
          this.showToast(this.error.statusText, 'danger');
        },
      );
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  editUser() {
    this.router.navigate([`/admin/user/${this.userProfile.id}`]);
  }


}
