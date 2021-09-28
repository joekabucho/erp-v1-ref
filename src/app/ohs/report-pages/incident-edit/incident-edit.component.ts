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
  selector: 'ngx-incident-edit',
  templateUrl: './incident-edit.component.html',
  styleUrls: ['./incident-edit.component.scss'],
})
export class IncidentPageEditComponent implements OnInit {
  keywordTicket = 'ticket_code';
  keywordSO = 'first_name';
  keywordTeamLead = 'first_name';
  keywordLoc = 'name';
  keywordDep = 'name';
  public incidentForm: FormGroup;
  public SelectedTbtTicket: number;
  Tickets: any;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  alive = true;
  public teamLead = [];
  Locations = [];
  Departments = [];
  male = 'male';
  female = 'female';
  other = 'other';
  none = 'none';
  public incidentId: any;
  public safetyOfficer = [];
  public selectedTicket: any;
  public selectedSO: any;
  public selectedLoc: any;
  public selectedTeam: any;
  public selectedDep: any;


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
  selectDep(item) {
    // do something with selected item
    this.selectedDep = item.id;
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
  onFocusedDepartment(e) {
    // do something when input is focused
    this.loadDepts();
  }
  loadTickets() {
    return this.toolboxService.fetchTickets().pipe(takeWhile(() => this.alive))
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
            return user.role.name === 'SUPERVISOR';
          }
        });
        this.safetyOfficer = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
      });
  }
  loadLocations() {
    return this.incidentsService.fetchLocations().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Locations = data.results;
      });
  }

  loadDepts() {
    return this.incidentsService.fetchDepartments().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Departments = data.results;
      });
  }
  editIncidents() {
    const payload = {
      'team_lead': this.selectedTeam,
      'ticket': this.selectedTicket,
      'name_of_worker': this.incidentForm.get('name_of_worker').value,
      'department': this.selectedDep,
      'description': this.incidentForm.get('description').value,
      'gender': this.incidentForm.get('gender').value,
      'time': this.incidentForm.get('time').value,
      'date_of_incident': this.incidentForm.get('date_of_incident').value,
      'injury_to_worker': this.incidentForm.get('injury_to_worker').value,
      'occupation': this.incidentForm.get('occupation').value,
      'location_of_incident': this.selectedLoc,
      'equipment_damage': this.incidentForm.get('equipment_damage').value,
      'name_of_person_reporting_incident': this.incidentForm.get('name_of_person_reporting_incident').value,
      'primary_witness': this.incidentForm.get('primary_witness').value,
      'secondary_witness': this.incidentForm.get('secondary_witness').value,
      'immediate_action_taken': this.incidentForm.get('immediate_action_taken').value,
      'post_incident_action': this.incidentForm.get('post_incident_action').value,
      'victim_taken_to': this.incidentForm.get('victim_taken_to').value,
      'report_sent_by': this.loggedInUser.id,
      'report_sent_to': this.selectedSO,
      'lta': this.incidentForm.get('lta').value,
      'lti': this.incidentForm.get('lti').value,
      'non_lti': this.incidentForm.get('non_lti').value,



    };
    this.incidentId = localStorage.getItem('incident');
    this.incidentsService.editIncidents(this.incidentId, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully edited the Job Incident', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Job Incident', 'danger');
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
