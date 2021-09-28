import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbSidebarService,
  NbThemeService,
  NbDialogService,
  NbComponentStatus,
  NbToastrService,
} from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, takeWhile } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../@core/services/auth.service';
import * as jwt_decode from 'jwt-decode';
import { UserService } from '../../../@core/services/user.service';
import { ChatNotificationService } from '../../../@core/services/chat-notification.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  alive = true;
  userMessages = [];
  unReadMessages = [];
  senderDetails: any;
  noImage = null;
  realTimeMessages: any;
  submitted = false;


  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  loggedInUserProfile: any;
  public profilePhoto: File = null;

  notifications = [];
  unReadNotes = [];

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }];


  constructor(
    private sidebarService: NbSidebarService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private chat: ChatNotificationService,
    private dialogService: NbDialogService,
    private toastr: NbToastrService,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.userService.refresh$.subscribe(
      () => {
        this.getUserProfile();
      },
    );
    this.getUserProfile();

    this.chat.messages.subscribe(msg => {
      this.realTimeMessages = msg.messages.filter(m => {
        return m.receiver.id === this.loggedInUser.id;
      });
      this.unReadMessages = this.realTimeMessages.filter(i => {
        return i.read === false;
      });
    });

    // this.chat.notifications.subscribe(n => {
    //   console.log(n);
    // })

    this.chat.refresh$.subscribe(
      () => {
        this.getUserNotifications();
      },
    );
    this.getUserMessages();
    this.getUserNotifications();
  }

  getUserProfile() {
    this.userService.fetchOneProfile(this.loggedInUser.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.loggedInUserProfile = data;
      });
  }




  onProfilePhotoSelected(event) {
    this.profilePhoto = event.target.files[0] as File;
    this.updateProfile();
  }

  updateProfile() {
    const formData = new FormData();
    const modalCloseBtn = document.getElementById('close-pic');

    formData.append('image', this.profilePhoto, this.profilePhoto.name);
    formData.append('image_name', this.profilePhoto.name);

    this.userService.editProfile(this.loggedInUserProfile.id, formData)
      .subscribe(() => {
        this.submitted = false;
        modalCloseBtn.click();
        this.showToast(`You have successfully updated ${this.loggedInUserProfile.username}`, 'success');
      },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error, 'danger');
        },
      );
  }



  getUserMessages() {
    this.chat.fetchMessages().subscribe(
      (data) => {
        this.userMessages = data.results.filter(m => {
          return m.receiver.id === this.loggedInUser.id;
        });
      },
    );
  }


  getUserNotifications() {
    this.chat.fetchNotifications(1000).subscribe(
      (data) => {
        this.notifications = data.results;
        this.unReadNotes = data.results.filter(n => {
          return n.read === false;
        });
      },
    );
  }


  viewMessages() {
    this.router.navigate([`/chat/messages`]);
  }

  viewNotifications() {
    this.router.navigate([`/chat/notifications`]);
  }

  openNotifications(dialog2: TemplateRef<any>) {
    this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
  }

  openProfileForm(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }


  logOut() {
    this.authService.signout(this.loggedInUser.session_id)
      .subscribe(
        () => { },
      );
    this.authService.logout();
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
