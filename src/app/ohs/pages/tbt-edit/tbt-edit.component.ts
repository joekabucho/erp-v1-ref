import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { ToolboxService } from '../../../@core/services/toolbox.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'ngx-tbt-edit',
  templateUrl: './tbt-edit.component.html',
  styleUrls: ['./tbt-edit.component.scss'],
})
export class TbtEditComponent implements OnInit {

  Tickets: any;
  attendants = [];
  public SelectedTbtTicket: number;
  public toolboxForm: FormGroup;
  Date;

  alive = true;
  public allattendants: any;
  public editId: any;

  constructor(
    public modalCtrl: ModalController,
    public toolboxService: ToolboxService,
    private toastr: NbToastrService,
    private fb: FormBuilder,

  ) {
    this.toolboxForm = this.fb.group({
      'date': this.Date,
      'agenda': [null, Validators.required],
      'done_by': [null, Validators.required],
      'attendants': this.allattendants,
    });
  }

  ngOnInit() {
    this.loadTickets();
    this.loadAttendants();
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  loadTickets() {
    let tbtInt;
    tbtInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +tbtInt;
    return this.toolboxService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results.filter(tickets => {
          return tickets.id === this.SelectedTbtTicket;
        });
      });
  }
 editToolboxTalks() {
    const modalCloseBtn = document.getElementById('close-edit');
    const payload = {
      'date': this.toolboxForm.get('date').value,
      'ticket': this.Tickets[0].id,
      'department': this.Tickets[0].department,
      'agenda': this.toolboxForm.get('agenda').value,
      'safety_officer': this.Tickets[0].safety_officer.id,
      'attendants': this.toolboxForm.get('attendants').value,
      'done_by': this.toolboxForm.get('done_by').value,

    };
    this.editId = localStorage.getItem('tbt');
    this.toolboxService.editToolboxTalk(this.editId, payload)
      .subscribe(
        () => {
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Toolbox Talk', 'success');
          this.modalCtrl.dismiss();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Toolbox Talk', 'danger');
        },
      );
  }
  loadAttendants() {
    return this.toolboxService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

}
