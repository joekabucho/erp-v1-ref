import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { TicketService } from '../../../@core/services/ticket.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'ngx-ticket-approval',
  templateUrl: './ticket-approval.component.html',
  styleUrls: ['./ticket-approval.component.scss'],
})
export class TicketApprovalComponent implements OnInit {
  allApprovals = [];
  approvalItem: any;
  approval_item;
  approver;
  requester;
  comment;
  status;
  loggedInUser: any;
  userToken = localStorage.getItem('currentUserToken');
  alive = true;


  Open: string = 'open';
  approved: string = 'approved';
  rejected: string = 'rejected';

  jobTickets: any;
  selectedJob: any;
  private SelectedTbtTicket: number;

  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              public ticketService: TicketService,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);

  }

  ngOnInit() {
    this.approvalItem = null;
    this.getTickets();
    let tbtInt;
    tbtInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +tbtInt;
    return this.ticketService.fetchTickets(100).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.jobTickets = data.results.filter(tickets => {
          return tickets.id === this.SelectedTbtTicket;
        });
      });
  }

  getTickets() {
    let tbtInt;
    tbtInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +tbtInt;
    return this.ticketService.fetchOneTicket( this.SelectedTbtTicket).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.jobTickets = data.results;

      });
  }
  createApproval() {
    const approvalItem = 'approval for ticket:' + this.jobTickets[0].ticket_code;
    const approvaldata = {
      'approver': this.loggedInUser.id,
      'requester': this.jobTickets[0].assigned_to.id,
      'approval_item': approvalItem,
      'comment': this.comment,
      'status': this.status,
    };
    const payload = {
      'ohs_approval': approvaldata,
    };
    this.ticketService.editTicket(this.jobTickets[0].id, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully approved the Ticket', 'success');
        },
        (error: HttpErrorResponse) => {
          // modalCloseBtn.click();
          this.showToast('Unable to approve Ticket', 'danger');
        },
      );
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }
}
