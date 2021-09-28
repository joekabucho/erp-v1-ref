import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { UserService } from '../../@core/services/user.service';
import { ChatNotificationService } from '../../@core/services/chat-notification.service';
import * as jwt_decode from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'ngx-contacts',
  styleUrls: ['./contacts.component.scss'],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit, OnDestroy {

  private alive = true;

  contacts: any[];
  recent: any[];

  selectedContact: any;
  userMessages = [];
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  messages: any[];

  authorId: any;
  receiverId: any;


  constructor(
    private userService: UserService,
    private chatService: ChatNotificationService,
    private toastr: NbToastrService,
    private route: ActivatedRoute,
    protected location: Location,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
    this.authorId = +this.route.snapshot.paramMap.get('authorId');
    this.receiverId = +this.route.snapshot.paramMap.get('receiverId');
    if (this.authorId === 0) { return; } else { this.getOneUser(); }
  }

  ngOnInit() {
    this.getUsers();
    this.getUserMessages();
  }

  getUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.contacts = data.results.filter(u => {
            return u.team !== null;
          });
          this.getRealTimeMessages();
        },
      );
  }

  getOneUser() {
    this.userService.fetchOneUser(this.authorId)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.selectedContact = data;
          this.selectContact(this.selectedContact);
        },
      );
  }


  selectContact(c) {
    const payload = {
      'read': true,
    };

    this.selectedContact = c;
    this.chatService.fetchMessages()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.messages = data.results.filter(m => {
            if (this.selectedContact.id === m.author.id || this.selectedContact.id === m.receiver.id) {
              return m.author.id === this.loggedInUser.id || m.receiver.id === this.loggedInUser.id;
            }
          });
          this.messages.forEach(i => {
            if (i.author.id === this.loggedInUser.id) {
              i.reply = true;
            } else {
              i.reply = false;
            }

            this.chatService.editMessage(i.id, payload)
              .subscribe(
                () => { },
                (error: HttpErrorResponse) => {
                  this.showToast('Unable to update your message at this time. Try again later', 'danger');
                },
              );
          });
          this.messages.reverse();
        },
      );
  }


  selectRecent(msg) {
    const payload = {
      'read': true,
    };

    this.selectedContact = msg.author;
    this.chatService.fetchMessages()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.messages = data.results.filter(m => {
            if (this.selectedContact.id === m.author.id || this.selectedContact.id === m.receiver.id) {
              return m.author.id === this.loggedInUser.id || m.receiver.id === this.loggedInUser.id;
            }
          });
          this.messages.forEach(i => {
            if (i.author.id === this.loggedInUser.id) {
              i.reply = true;
            } else {
              i.reply = false;
            }

            this.chatService.editMessage(i.id, payload)
              .subscribe(
                () => { },
                (error: HttpErrorResponse) => {
                  this.showToast('Unable to update your message at this time. Try again later', 'danger');
                },
              );
          });
          this.messages.reverse();
        },
      );
  }


  getRealTimeMessages() {
    this.chatService.messages.subscribe(msg => {
      this.contacts.forEach(c => {
        this.userMessages = msg.messages.filter(i => {
          return i.author.id === c.id && i.receiver.id === this.loggedInUser.id && i.read === false;
        });
        c.allSms = this.userMessages.length;
      });
    });
  }


  getUserMessages() {
    this.chatService.fetchMessages()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.recent = data.results.filter(m => {
            return m.receiver.id === this.loggedInUser.id;
          });
        },
      );
  }


  sendMessage(event: any) {
    const senderId = this.loggedInUser.id;
    const receiverId = this.selectedContact.id;

    const payload = {
      'content': event.message,
      'author': senderId,
      'receiver': receiverId,
    };

    this.chatService.createChatMessage(senderId, receiverId, payload)
      .subscribe(
        (data) => {
          this.messages.push(data);
          this.messages.forEach(i => {
            if (i.author.id === this.loggedInUser.id) { i.reply = true; } else { i.reply = false; }
          });
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to send your message at this time. Try again later', 'danger');
        },
      );
  }


    back() {
      this.location.back();
      return false;
    }


  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
