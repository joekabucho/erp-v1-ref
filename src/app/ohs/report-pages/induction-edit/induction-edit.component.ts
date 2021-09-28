import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { InductionService } from '../../../@core/services/induction.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../@core/services/user.service';
@Component({
  selector: 'ngx-induction-edit',
  templateUrl: './induction-edit.component.html',
  styleUrls: ['./induction-edit.component.scss'],
})
export class InductionPageEditComponent implements OnInit {

  public selectedTicket: any;
  public selectedSO: any;
  public selectedLoc: any;
  public selectedTeam: any;
  keywordTicket = 'ticket_code';
  keywordSO = 'first_name';
  keywordTeamLead = 'first_name';
  keywordLoc = 'name';
  Tickets: any;
  attendants = [];
  public inductionForm: FormGroup;
  public teamLead: any;
  Date;
  Locations = [];


  alive = true;
  public inductionId: any;
  public safetyOfficer = [];
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
      'ticket': ['', Validators.required],
      'location': ['', Validators.required],
      'safety_officer': ['', Validators.required],
      'attendants': this.attendants,
    });
  }

  ngOnInit() {
    this.loadTickets();
    this.loadAttendants();
    this.getAllUsers();
    this.loadLocations();
  }
  selectedTicketID(item) {
    // do something with selected item
    this.selectedTicket = item.id;
  }
  selectSO(item) {
    // do something with selected item
    this.selectedSO = item.id;
  }
  selectTeam(item) {
    // do something with selected item
    this.selectedTeam = item.id;
  }
  selectLoc(item) {
    // do something with selected item
    this.selectedLoc = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedLoc(e) {
    // do something when input is focused
    this.loadLocations();
  }
  onFocusedTickets(e) {
    // do something when input is focused
    this.loadTickets();
  }
  onFocusedSo(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  onFocusedTeam(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  loadTickets() {
    return this.InductionChecklistService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results;
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
        this.safetyOfficer = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
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
  loadLocations() {
    return this.InductionChecklistService.fetchLocations().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Locations = data.results;
      });
  }
  editSafetyInductions() {
    const payload = {
      'date': this.inductionForm.get('date').value,
      'ticket': this.selectedTicket,
      'activity': this.inductionForm.get('activity').value,
      'location': this.selectedLoc,
      'team_lead': this.selectedTeam,
      'safety_officer': this.selectedSO,
      'attendants': this.inductionForm.get('attendants').value,
      'done_by': this.inductionForm.get('done_by').value,

    };
    this.inductionId = localStorage.getItem('induction');
    this.InductionChecklistService.editSafetyInductions( this.inductionId, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully edited the Safety induction checklist', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Safety induction checklist', 'danger');
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

