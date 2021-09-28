import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { InductionService } from '../../../@core/services/induction.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../@core/services/user.service';
import { AttendantsComponent } from '../attendants/attendants.component';


@Component({
  selector: 'ngx-induction-create-modal',
  templateUrl: './induction-create-modal.component.html',
  styleUrls: ['./induction-create-modal.component.scss'],
})
export class InductionCreateModalComponent implements OnInit {
  Tickets: any;
  attendants = [];
  public SelectedTbtTicket: number;
  public inductionForm: FormGroup;
  public teamLead: any;
  Date;
  keywordTeamLead = 'first_name';
  public selectedTeam: any;

  alive = true;
  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              private fb: FormBuilder,
             public InductionChecklistService: InductionService,
              private userService: UserService,
  ) {
    this.inductionForm = this.fb.group({
      'date': this.Date,
      'activity': ['', Validators.required],
      'team_lead': ['', Validators.required],
      'done_by': ['', Validators.required],
      'attendants': this.attendants,
    });
  }

  ngOnInit() {
    this.loadTickets();
    this.loadAttendants();
    this.getAllUsers();
  }
  selectTeam(item) {
    // do something with selected item
    this.selectedTeam = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocusedTeam(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  loadTickets() {
    let inductionInt;
    inductionInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +inductionInt;
    return this.InductionChecklistService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results.filter(tickets => {
          return tickets.id === this.SelectedTbtTicket;
        });
      });
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.teamLead = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TEAM LEAD';
          }
        });
      });
  }
  loadAttendants() {
    return this.InductionChecklistService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
  }
  createSafetyInduction() {
    const payload = {
      'date': this.inductionForm.get('date').value,
      'ticket': this.Tickets.id,
      'activity': this.inductionForm.get('activity').value,
      'location': this.Tickets.location.id,
      'team_lead': this.selectedTeam,
      'safety_officer': this.Tickets.safety_officer.id,
      'attendants': this.inductionForm.get('attendants').value,
      'done_by': this.inductionForm.get('done_by').value,

    };
    this.InductionChecklistService.createSafetyInductions( payload)
      .subscribe(
        () => {
          this.showToast('You have successfully created the Safety induction checklist', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to create Safety induction checklist', 'danger');
        },
      );
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: InductionCreateModalComponent,
    });
    return await modal.present();
  }
  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }
  async showAttendants() {
    const modal = await this.modalCtrl.create({
      component: AttendantsComponent,
    });
    return await modal.present();
  }
}
