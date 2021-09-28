import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ChatNotificationService } from '../../@core/services/chat-notification.service';
import * as jwt_decode from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';


@Component({
  selector: 'ngx-notification',
  styleUrls: ['./notification.component.scss'],
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit, OnDestroy {

  private alive = true;
  userToken = localStorage.getItem('currentUserToken');


  allNotifications = [];
  unReadNotes = [];
  loggedInUser: any;
  isChecked: boolean;
  selectedNotifications = [];

  constructor(
    private chat: ChatNotificationService,
    private toastr: NbToastrService,
    protected location: Location,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
  }


  ngOnInit() {
    this.chat.refresh$.subscribe(
      () => {
        this.getUserNotifications();
      },
    );
    this.getUserNotifications();
  }


  getUserNotifications() {
    this.chat.fetchNotifications(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        (data) => {
          this.allNotifications = data.results;
          this.allNotifications.reverse();
          this.unReadNotes = data.results.filter(n => {
            return n.read === false;
          });
        },
      );
  }


  readNotification() {
    const payload = {
      'read': true,
    };

    this.selectedNotifications.forEach(notify => {
      this.chat.editNotification(notify.id, payload)
        .subscribe(
          () => {
            // this.showToast('Successfully read your notification. You are now up to date', 'success');
            this.selectedNotifications = [];
          },
          (error: HttpErrorResponse) => {
            this.showToast('Unable to update your notification at this time. Try again later', 'danger');
            this.selectedNotifications = [];
          },
        );
    });
  }

  changed(evt, note) {
    this.isChecked = evt.target.checked;

    if (this.isChecked) {
      this.selectedNotifications.push(note);
    } else {
      this.selectedNotifications = this.selectedNotifications.filter(n => {
        return n.id !== note.id;
      });
    }
  }

  selectAll(evt) {
    this.isChecked = evt.target.checked;

    if (this.isChecked) {
      this.allNotifications.forEach(note => {
        note.checked = true;
        this.selectedNotifications.push(note);
      });
    } else {
      this.allNotifications.forEach(note => {
        note.checked = false;
        this.selectedNotifications = [];
      });
    }
  }


  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
