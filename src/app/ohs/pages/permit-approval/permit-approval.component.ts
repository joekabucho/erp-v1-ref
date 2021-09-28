import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { TicketService } from '../../../@core/services/ticket.service';
import { WorkpermitService } from '../../../@core/services/workpermit.service';

import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'ngx-permit-approval',
  templateUrl: './permit-approval.component.html',
  styleUrls: ['./permit-approval.component.scss'],
})
export class PermitApprovalComponent implements OnInit {
  allApprovals = [];
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

  public jobTickets: any;
  selectedJob: any;
  public SelectedTbtTicket: number;
  public SelectedPermit: any;

  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              public ticketService: TicketService,
              public permitService: WorkpermitService,
              ) {
    this.loggedInUser = jwt_decode(this.userToken);

  }

  ngOnInit() {
    this.loadTickets();

  }
  loadTickets() {
    let tbtInt;
    tbtInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +tbtInt;
    return this.ticketService.fetchOneTicket(this.SelectedTbtTicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.jobTickets = data;
      });
  }
  createApproval() {
    const approvalItem = 'approval for PTW:' + this.jobTickets.ticket_code;
    const approvaldata = {
      'approver': this.loggedInUser.id,
      'requester': this.jobTickets.assigned_to.id,
      'approval_item': approvalItem,
      'comment': this.comment,
      'status': this.status,
    };
    const payload = {
      'approval': approvaldata,
    };
    let perm;
    perm = localStorage.getItem('selectedPTW');
    this.SelectedPermit = +perm;
    this.permitService.editWorkpermits(this.SelectedPermit, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully approved the Permit', 'success');
        },
        (error: HttpErrorResponse) => {
          // modalCloseBtn.click();
          this.showToast('Unable to approve Permit', 'danger');
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
