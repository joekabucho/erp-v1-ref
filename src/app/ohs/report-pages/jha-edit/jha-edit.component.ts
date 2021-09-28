import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { HazardService } from '../../../@core/services/hazard.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../@core/services/user.service';

@Component({
  selector: 'ngx-jha-edit',
  templateUrl: './jha-edit.component.html',
  styleUrls: ['./jha-edit.component.scss'],
})
export class JhaPageEditComponent implements OnInit {

  Tickets: any;

  hazards = [];

  public hazForm: FormGroup;
  alive = true;
  public SelectedTbtTicket: number;
  public Supervisor = [];
  public attendants: any;
  public editId: any;


  keywordTicket = 'ticket_code';
  keywordSO = 'first_name';
  public selectedTicket: any;
  public selectedSup: any;

  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              private fb: FormBuilder,
              public hazardService: HazardService,
              private userService: UserService,

  ) {
    this.hazForm = this.fb.group({
      'job_hazards': [null, Validators.required],
      'fire_fighter': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'team_members': [null, Validators.required],
      'supervisor': [null, Validators.required],
      'date': [null, Validators.required],
      'ticket': [null, Validators.required],
      'done_by': [null, Validators.required],

    });
  }

  ngOnInit() {
    this.loadTickets();
    this.getAllUsers();
    this.getHazards();
    this.loadAttendants();
  }
  selectedTicketSup(item) {
    // do something with selected item
    this.selectedTicket = item.id;
  }
  selectSup(item) {
    // do something with selected item
    this.selectedSup = item.id;
  }

  onFocusedTickets(e) {
    // do something when input is focused
    this.loadTickets();
  }
  onFocusedSup(e) {
    // do something when input is focused
    this.getAllUsers();
  }

  loadTickets() {
    return this.hazardService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results;
      });
  }
  editHazard() {
    const payload = {
      'job_hazards': this.hazForm.get('job_hazards').value,
      'ticket': this.selectedTicket,
      'fire_fighter': this.hazForm.get('fire_fighter').value,
      'first_aider': this.hazForm.get('first_aider').value,
      'team_members': this.hazForm.get('team_members').value,
      'supervisor': this.selectedSup,
      'date': this.hazForm.get('date').value,
      'done_by': this.hazForm.get('done_by').value,

    };
    this.editId = localStorage.getItem('jha');
    this.hazardService.editHazardAnalysis(this.editId, payload)
      .subscribe(
        () => {
          this.showToast('You have edited added the Analysis', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Analysis', 'danger');
        },
      );
  }
  loadAttendants() {
    return this.hazardService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Supervisor = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SUPERVISOR';
          }
        });
      });
  }
  getHazards() {
    this.hazardService.fetchHazards(100)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.hazards = data.results;
        });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

}
