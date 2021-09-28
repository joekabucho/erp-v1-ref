import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { IncidentsService } from '../../../@core/services/incident.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToolboxService } from '../../../@core/services/toolbox.service';
import * as jwt_decode from 'jwt-decode';
import {UserService} from '../../../@core/services/user.service';




@Component({
  selector: 'ngx-incident-create-modal',
  templateUrl: './incident-create-modal.component.html',
  styleUrls: ['./incident-create-modal.component.scss'],
})
export class IncidentCreateModalComponent implements OnInit {

  public incidentForm: FormGroup;
  public SelectedTbtTicket: number;
  Tickets: any;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  alive = true;
  public teamLead = [];

  male = 'male';
  female = 'female';
  other = 'other';
  none = 'none';


  keywordLoc = 'name';
  keywordTeamLead = 'first_name';
  public selectedLoc: any;
  public selectedTeam: any;


  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              private fb: FormBuilder,
              public incidentsService: IncidentsService,
              public toolboxService: ToolboxService,
              private userService: UserService,

  ) {
    this.loggedInUser = jwt_decode(this.userToken);

    this.incidentForm = this.fb.group({
    'team_lead': [null, Validators.required],
    'name_of_worker': [null, Validators.required],
    'description': [null, Validators.required],
    'gender': [null, Validators.required],
    'time': [null, Validators.required],
    'date_of_incident': [null, Validators.required],
    'occupation': [null, Validators.required],
    'location_of_incident': [null, Validators.required],
    'name_of_person_reporting_incident': [null, Validators.required],
    'primary_witness': [null, Validators.required],
    'secondary_witness': [null, Validators.required],
    'immediate_action_taken': [null, Validators.required],
    'post_incident_action': [null, Validators.required],
    'victim_taken_to': [null, Validators.required],
    'report_sent_to': [null, Validators.required],
    'lta': [null, Validators.required],
    'lti': [null, Validators.required],
    'non_lti': [null],
    'equipment_damage': [null],
    'injury_to_worker': [null],

  });
  }

  ngOnInit() {
    this.loadTickets();
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
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.teamLead = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SUPERVISOR';
          }
        });
      });
  }
  createIncidents() {
    const payload = {
      'team_lead': this.selectedTeam,
      'ticket': this.Tickets.id,
      'name_of_worker': this.incidentForm.get('name_of_worker').value,
      'department': this.Tickets.department,
      'description': this.incidentForm.get('description').value,
      'gender': this.incidentForm.get('gender').value,
      'time': this.incidentForm.get('time').value,
      'date_of_incident': this.incidentForm.get('date_of_incident').value,
      'injury_to_worker': this.incidentForm.get('injury_to_worker').value,
      'occupation': this.incidentForm.get('occupation').value,
      'location_of_incident': this.Tickets.location.id,
      'equipment_damage': this.incidentForm.get('equipment_damage').value,
      'name_of_person_reporting_incident': this.incidentForm.get('name_of_person_reporting_incident').value,
      'primary_witness': this.incidentForm.get('primary_witness').value,
      'secondary_witness': this.incidentForm.get('secondary_witness').value,
      'immediate_action_taken': this.incidentForm.get('immediate_action_taken').value,
      'post_incident_action': this.incidentForm.get('post_incident_action').value,
      'victim_taken_to': this.incidentForm.get('victim_taken_to').value,
      'report_sent_by': this.loggedInUser.id,
      'report_sent_to': this.Tickets.safety_officer.id,
      'lta': this.incidentForm.get('lta').value,
      'lti': this.incidentForm.get('lti').value,
      'non_lti': this.incidentForm.get('non_lti').value,



    };
    this.incidentsService.createIncidents( payload)
      .subscribe(
        () => {
          this.showToast('You have successfully created the Job Incident', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to create Job Incident', 'danger');
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
