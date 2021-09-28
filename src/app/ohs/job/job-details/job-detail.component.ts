import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import {DatePipe, Location} from '@angular/common';
import { TicketService } from '../../../@core/services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { ResourceService } from '../../../@core/services/ohs-resource.service';
import { NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { InductionService } from '../../../@core/services/induction.service';
import { UserService } from '../../../@core/services/user.service';
import { HazardService } from '../../../@core/services/hazard.service';
import { WorkpermitService } from '../../../@core/services/workpermit.service';
import { CommunicationPlanService } from '../../../@core/services/communication-plan.service';
import { IncidentsService } from '../../../@core/services/incident.service';
import { ToolBoxTalks } from '../../../@core/models/toolboxtalks';
import {JobIncidents} from '../../../@core/models/incidents';
import {SafetyInduction} from '../../../@core/models/induction';
import { HazardAnalysis } from '../../../@core/models/hazard-Analysis';


import * as jwt_decode from 'jwt-decode';
import { ToolboxService } from '../../../@core/services/toolbox.service';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import { Workpermit } from '../../../@core/models/workpermit';
import {faMinusCircle, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {CommunicationPlan} from '../../../@core/models/communication';

@Component({
  selector: 'ngx-job-detail',
  styleUrls: ['./job-detail.component.scss'],
  templateUrl: './job-detail.component.html',
})
export class JobDetailComponent implements OnInit, OnDestroy {

  keywordTeamLead = 'first_name';
  keywordSup = 'first_name';
  keywordPM = 'first_name';
  keywordHOD = 'first_name';
  keywordLoc = 'name';


  alive = true;

  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  openMenu: Boolean = false;


  permitForm: FormGroup;

  ToolboxTalks = [];
  SelectedToolboxTicket;
  Inductionchecklist = [];
  SelectedInductionTicket;
  jobTicket: any;

  images = ['Image 1', 'Image 2', 'Image 3', 'Image 4'];

  permits = [];
  workPermits = [];
  certificates = [];
  ppes = [];
  sse = [];
  allApprovals = [];
  dateToday: any = new Date;
  approvalItem: any;
  submitted: boolean;
  selectedPPE: any;
  ptw: any;


  selectedJob: any;
  selectedEquipment: any;
  hod = [];
  supervisor = [];
  projectManager = [];
  communication = [];
  hazards = [];
  selectedChecklistHazards;

  jobHazards = [];

  plus = faPlusCircle;
  minus = faMinusCircle;

  Date;
  allattendants = [];
  selectedWorkPermits = [];


  approver;
  requester;
  approval_item;
  comment;
  status;
  approved = 'approved';
  rejected = 'rejected';


  sseFile: File = null;
  ppeFile: File = null;

  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  coordinates = [];
  long: any;
  zoom: any;
  address: string;
  public incident: any = [];

  toolboxElements = ['Date', 'Reference Number', 'Safety Officer', 'Department', 'Agenda', 'Attendants', 'Done By', 'Edit'];
  inudctionElements = ['Date', 'Location', 'Safety Officer', 'Team Lead', 'Attendants', 'Done By', 'Edit'];
  jhaElements = ['Date', 'Description', 'Job Hazards', 'First Aider', 'Fire Fighter', 'Supervisor', 'Team Members', 'Done By', 'Edit'];
  commElements = ['DATE', 'TIME', 'NAME', 'LOCATION', 'SITE', 'SCOPE', 'PROJECT MANAGER', 'FIRST AIDER',
    'FIRST AIDER TEL NO', 'FIRE MARSHALL', 'FIRE MARSHALL TEL NO', 'NEAREST POLICE', 'NEAREST POLICE TEL NO', 'NEAREST HOSPITAL', 'NEAREST HOSPITAL TEL NO', 'WHAT TO SO IN AN EMERGENCY', ' WHAT TO SO IN AN ACCIDENT', ' CREATED BY',  'EDIT'];

  incidentElements = [ 'TEAM LEAD', 'TICKET', 'NAME OF WORKER', 'DEPARTMENT', 'DESCRIPTION',
    'GENDER', 'TIME', 'DATE OF INCIDENT', 'INJURY TO WORKER', 'OCCUPATION', 'LOCATION OF INCIDENT', 'EQUIPMENT DAMAGE', 'NAME OF PERSON REPORTING INCIDENT', 'PRIMARY WITNESS', 'SECONDARY WITNESS', 'IMMEDIATE ACTION TAKEN', 'POST INCIDENT ACTION', 'VICTIM TAKEN TO', 'REPORT SENT BY', 'REPORT SENT TO', 'LTA', 'LTI', 'NON-LTI', 'EDIT'];
  public sseForm: FormGroup;
  public inductionForm: FormGroup;
  public attendantsForm: FormGroup;
  public workpermitForm: FormGroup;
  public hazForm: FormGroup;
  public ppeForm: FormGroup;
  public attendants: any;
  public toolboxForm: FormGroup;
  public sseEditForm: FormGroup;
  public inductionEditForm: FormGroup;
  public attendantsEditForm: FormGroup;
  public workpermitEditForm: FormGroup;
  public hazEditForm: FormGroup;
  public ppeEditForm: FormGroup;
  public toolboxEditForm: FormGroup;
  communicationForm: FormGroup;
  communicationEditForm: FormGroup;
  public Tickets: any;
  public Departments: any;
  public ppenames: any;
  public ssenames: any;
  public Site: any;
  public Locations: any;
  public safetyOfficer: any;
  public teamLead: any;
  public technician: any;
  public incidentForm: FormGroup;

  male = 'male';
  female = 'female';
  other = 'other';
  none = 'none';
  checked = false;
  public selectedHazard: any;
  public incidentEditForm: any;
  public selectedInduction: any;
  public selectedIncident: any;
  public selectedTBT: any;
  public selectedPPEFile: any;
  public selectedSSEFile: any;
  public commPlan = [];
  public selectedCommPlan: any;

  public selectedLoc: any;
  public selectedTeam: any;
  public selectedPM: any;
  public selectedSup: any;
  public selectedHOD: any;




  constructor(
    protected _location: Location,
    private ticketService: TicketService,
    private resourceService: ResourceService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private toastr: NbToastrService,
    public ToolboxTalksService: ToolboxService,
    public InductionChecklistService: InductionService,
    public workpermitService: WorkpermitService,
    private userService: UserService,
    public CommunicationService: CommunicationPlanService,
    public hazardService: HazardService,
    private fb: FormBuilder,
    public IncidentService: IncidentsService,
    public  incidentsService: IncidentsService,
    private datePipe: DatePipe,

  ) {
    this.approvalItem = null;
    this.loggedInUser = jwt_decode(this.userToken);
    this.permitForm = this.fb.group({
      'hod': [null],
      'project_manager': [null],
      'supervisor': [null],
      'permits': [null],
      'safety_or_concerns': [null],
      'safety_access': [null],
    });
    this.inductionForm = this.fb.group({
      'date': this.Date,
      'activity': ['', Validators.required],
      'team_lead': ['', Validators.required],
      'done_by': ['', Validators.required],
      'attendants': this.allattendants,
    });
    this.attendantsForm = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'phone_number': [null, Validators.required],
      'id_number': [null, Validators.required],
    });
    this.workpermitForm = this.fb.group({
      'safety_or_concerns': [null],
      'safety_access': [null],
      'project_manager': [null],
      'hod': [null],
      'permits': this.selectedWorkPermits,


    });
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
    this.hazForm = this.fb.group({
      'job_hazards': [null, Validators.required],
      'description': [null, Validators.required],
      'fire_fighter': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'team_members': [null, Validators.required],
      'supervisor': [null, Validators.required],
      'date': [null, Validators.required],
      'done_by': [null, Validators.required],

    });
    this.toolboxForm = this.fb.group({
      'date': this.Date,
      'agenda': [null, Validators.required],
      'done_by': [null, Validators.required],
      'attendants': this.allattendants,
    });
    this.ppeForm = this.fb.group({
      ppe_items: this.fb.array([this.fb.group({
        file: ['', Validators.required],
        ppe_names: [null, Validators.required]})]),
    });
    this.sseForm = this.fb.group({
      sse_items: this.fb.array([this.fb.group({
        file: ['', Validators.required],
        safety_officer: [null, Validators.required],
        site: [null, Validators.required],
        ticket: [null, Validators.required],
        name: [null, Validators.required]})]),
    });

    this.workpermitEditForm = this.fb.group({
      'hod': [null],
      'project_manager': [null],
      'supervisor': [null],
      'permits': [null],
      'safety_or_concerns': [null],
      'safety_access': [null],
    });
    this.inductionEditForm = this.fb.group({
      'date': this.Date,
      'activity': ['', Validators.required],
      'team_lead': ['', Validators.required],
      'done_by': ['', Validators.required],
      'attendants': this.allattendants,
    });
    this.attendantsEditForm = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'phone_number': [null, Validators.required],
      'id_number': [null, Validators.required],
    });
    this.workpermitEditForm = this.fb.group({
      'safety_or_concerns': [null],
      'safety_access': [null],
      'project_manager': [null],
      'hod': [null],
      'permits': this.selectedWorkPermits,


    });
    this.incidentEditForm = this.fb.group({
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
    this.hazEditForm = this.fb.group({
      'job_hazards': [null, Validators.required],
      'description': [null, Validators.required],
      'fire_fighter': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'team_members': [null, Validators.required],
      'supervisor': [null, Validators.required],
      'date': [null, Validators.required],
      'done_by': [null, Validators.required],

    });
    this.toolboxEditForm = this.fb.group({
      'date': this.Date,
      'agenda': [null, Validators.required],
      'done_by': [null, Validators.required],
      'attendants': this.allattendants,
    });
    this.ppeEditForm = this.fb.group({
      ppe_items: this.fb.array([this.fb.group({
        file: ['', Validators.required],
        ppe_names: [null, Validators.required]})]),
    });
    this.sseEditForm = this.fb.group({
      sse_items: this.fb.array([this.fb.group({
        file: ['', Validators.required],
        safety_officer: [null, Validators.required],
        site: [null, Validators.required],
        ticket: [null, Validators.required],
        name: [null, Validators.required]})]),
    });

    this.communicationForm = this.fb.group({
      'date': [null, Validators.required],
      'project_manager': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'first_aider_phone': [null, Validators.required],
      'fire_marshall': [null, Validators.required],
      'fire_marshall_phone': [null, Validators.required],
      'nearest_police': [null, Validators.required],
      'nearest_police_phone': [null, Validators.required],
      'nearest_hospital': [null, Validators.required],
      'nearest_hospital_phone': [null, Validators.required],
      'what_do_in_an_emergency': [null, Validators.required],
      'what_do_in_an_accident': [null, Validators.required],
      'name': [null, Validators.required],

    });
    this.communicationEditForm = this.fb.group({
      'date': [null, Validators.required],
      'project_manager': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'first_aider_phone': [null, Validators.required],
      'fire_marshall': [null, Validators.required],
      'fire_marshall_phone': [null, Validators.required],
      'nearest_police': [null, Validators.required],
      'nearest_police_phone': [null, Validators.required],
      'nearest_hospital': [null, Validators.required],
      'nearest_hospital_phone': [null, Validators.required],
      'what_do_in_an_emergency': [null, Validators.required],
      'what_do_in_an_accident': [null, Validators.required],
      'name': [null, Validators.required],
    });
  }

  ngOnInit() {
    this.resourceService.refresh$.subscribe(
      () => {
        this.getPermits();
        this.getPPEs();
        this.getSEE();
      },
    );
    this.ticketService.refresh$.subscribe(
      () => {
        this.getTicket();
      },
    );
    this.CommunicationService.refresh$.subscribe(
      () => {
        this.getCommPlan();
      },
    );
    this.ToolboxTalksService.refresh$.subscribe(
      () => {
        this.loadToolboxTalks();
      },
    );
    this.IncidentService.refresh$.subscribe(
      () => {
        this.getIncident();
      },
    );
    this.InductionChecklistService.refresh$.subscribe(
      () => {
        this.loadInductionchecklists();
      },
    );
    this.getTicket();
    this.loadToolboxTalks();
    this.loadInductionchecklists();
    this.setCurrentLocation();
    this.getIncident();
    this.transformDate();
    this.getCommPlan();

  }
  transformDate() {
    this.Date = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }

  selectTeam(item) {
    // do something with selected item
    this.selectedTeam = item.id;
  }
  selectPM(item) {
    // do something with selected item
    this.selectedPM = item.id;
  }
  selectHOD(item) {
    // do something with selected item
    this.selectedHOD = item.id;
  }
  selectSup(item) {
    // do something with selected item
    this.selectedSup = item.id;
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
  onFocusedTeam(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  onFocusedHOD(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  onFocusedPM(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  onFocusedSup(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  getTicket() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.ticketService.fetchOneTicket(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobTicket = data;
          this.getJHA();
          this.getPPEs();
          this.getSEE();
          this.getCertificates();
          this.getPermits();
        },
      );
  }
  getHazards() {
    let hazardInt;
    hazardInt = localStorage.getItem('selectedTicket');
    this.selectedChecklistHazards = hazardInt;
    this.hazardService.fetchHazardAnalysisByTicket(this.selectedChecklistHazards)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.hazards = data.results;
        },
      );
  }

  get ppeItems() {
    return this.ppeForm.get('ppe_items') as FormArray;
  }

  addPpeItems() {
    this.ppeItems.push(this.fb.group({
      file: [''],
      technician: [null, Validators.required],
      safety_officer: [null, Validators.required],
      ticket: [null, Validators.required],
      ppe_names: [null, Validators.required],
    }));
  }

  deletePpeItems(index) {
    this.ppeItems.removeAt(index);
  }

  get sseItems() {
    return this.sseForm.get('sse_items') as FormArray;
  }

  addSseItems() {
    this.sseItems.push(this.fb.group({
      file: [''],
      safety_officer: [null, Validators.required],
      site: [null, Validators.required],
      ticket: [null, Validators.required],
      name: [null, Validators.required],
    }));
  }

  deleteSseItems(index) {
    this.sseItems.removeAt(index);
  }

  selectedSiteID(id) {
    localStorage.setItem('selectedWorkpermitSiteId', id);
  }

  loadToolboxTalks() {
    let tbtInt;
    tbtInt = localStorage.getItem('selectedTicket');
    this.SelectedToolboxTicket = +tbtInt;
    return this.ToolboxTalksService.fetchToolboxTalksByTicket(this.SelectedToolboxTicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.ToolboxTalks = data.results;
      });
  }

  getPPENames() {
    this.resourceService.fetchPPE(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ppenames = data.results;
        },
      );
  }

  getSSENames() {
    this.resourceService.fetchSiteSSE(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ssenames = data.results;
        },
      );
  }
  loadInductionchecklists() {
    let inductionInt;
    inductionInt = localStorage.getItem('selectedTicket');
    this.SelectedInductionTicket = +inductionInt;
    return this.InductionChecklistService.fetchSafetyInductionsByTicket(this.SelectedInductionTicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Inductionchecklist = data.results;
      });
  }
  savePPEFile(ppeitems) {
    const modalCloseBtn = document.getElementById('close-ppe');
    const formData = new FormData;
    this.submitted = true;

    for (let j = 0; j <= ppeitems.ppe_items.length - 1; j ++) {
      formData.append('ppe_names', ppeitems.ppe_items[j].ppe_names);
      formData.append('safety_officer', this.jobTicket.safety_officer.id),
        formData.append('ticket', this.jobTicket.id),
        formData.append('file', this.ppeFile, this.ppeFile.name);
      formData.append('file_type', this.ppeFile.type);
      formData.append('technician', this.jobTicket.assigned_to.id);

      this.resourceService.createPPEFile(formData)
        .subscribe(
          () => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast('You have successfully added a File', 'success');
            this.ppeForm.reset();
          },
          (error: HttpErrorResponse) => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast(error.error.errors.name, 'danger');
          },
        );
    }
  }
  saveSSEFile(sseitems) {
    const modalCloseBtn = document.getElementById('close-sse');
    const formData = new FormData;
    this.submitted = true;

    for (let j = 0; j <= sseitems.sse_items.length - 1; j ++) {
      formData.append('name', sseitems.sse_items[j].name);
      formData.append('site', sseitems.sse_items[j].site);
      formData.append('ticket', this.jobTicket.id);
      formData.append('safety_officer', this.jobTicket.safety_officer.id);
      formData.append('file', this.sseFile, this.sseFile.name);
      formData.append('file_type', this.sseFile.type);
      this.resourceService.createSSEFile(formData)
        .subscribe(
          () => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast('You have successfully added a File', 'success');
            this.sseForm.reset();
          },
          (error: HttpErrorResponse) => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast(error.error.errors.name, 'danger');
          },
        );
    }
  }

  createIncidents() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'team_lead': this.selectedTeam,
      'ticket': this.jobTicket.id,
      'name_of_worker': this.incidentForm.get('name_of_worker').value,
      'department': this.jobTicket.department,
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
      'report_sent_to': this.jobTicket.safety_officer.id,
      'lta': this.incidentForm.get('lta').value,
      'lti': this.incidentForm.get('lti').value,
      'non_lti': this.incidentForm.get('non_lti').value,



    };
    this.incidentsService.createIncidents( payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created the Job Incident', 'success');
          this.getIncident();
          this.incidentForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to create Job Incident', 'danger');
        },
      );
  }
  createToolboxTalks() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'date': this.toolboxForm.get('date').value,
      'ticket': this.jobTicket.id,
      'department': this.jobTicket.department,
      'agenda': this.toolboxForm.get('agenda').value,
      'safety_officer': this.jobTicket.safety_officer.id,
      'attendants': this.toolboxForm.get('attendants').value,
      'done_by': this.toolboxForm.get('done_by').value,

    };
    this.ToolboxTalksService.createToolboxTalk(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created the Toolbox Talk', 'success');
          this.loadToolboxTalks();
          this.toolboxForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to created Toolbox Talk', 'danger');
        },
      );
  }
  loadAttendants() {
    return this.ToolboxTalksService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
  }
  loadTickets() {
    return this.ToolboxTalksService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results;
      });
  }
  loadDepts() {
    return this.ToolboxTalksService.fetchDepartments().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Departments = data.results;
      });
  }

  createAttendants() {
    const modalCloseBtn = document.getElementById('close-attendant');
    this.submitted = true;
    const payload = {
      'firstname': this.attendantsForm.get('firstname').value,
      'lastname': this.attendantsForm.get('lastname').value,
      'phone_number': this.attendantsForm.get('phone_number').value,
      'id_number': this.attendantsForm.get('id_number').value,
    };
    this.ToolboxTalksService.createAttendants(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created an attendant', 'success');
          this.loadToolboxTalks();
          this.loadAttendants();
          this.attendantsForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to created attendant', 'danger');
        },
      );
  }

  createSafetyInduction() {
    const modalCloseBtn = document.getElementById('close-induction-create');
    this.submitted = true;
    const payload = {
      'date': this.inductionForm.get('date').value,
      'ticket': this.jobTicket.id,
      'activity': this.inductionForm.get('activity').value,
      'team_lead': this.selectedTeam,
      'safety_officer': this.jobTicket.safety_officer.id,
      'attendants': this.inductionForm.get('attendants').value,
      'done_by': this.inductionForm.get('done_by').value,

    };
    this.InductionChecklistService.createSafetyInductions( payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created the Safety induction checklist', 'success');
          this.loadInductionchecklists();
          this.inductionForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to create Safety induction checklist', 'danger');
        },
      );
  }
  saveHazard() {
    const modalCloseBtn = document.getElementById('close-jha');
    this.submitted = true;
    const payload = {
      'job_hazards': this.hazForm.get('job_hazards').value,
      'ticket': this.jobTicket.id,
      'description': this.hazForm.get('description').value,
      'fire_fighter': this.hazForm.get('fire_fighter').value,
      'first_aider': this.hazForm.get('first_aider').value,
      'team_members': this.hazForm.get('team_members').value,
      'supervisor': this.selectedSup,
      'date': this.hazForm.get('date').value,
      'done_by': this.hazForm.get('done_by').value,

    };
    this.hazardService.createHazardAnalysis(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added the Analysis', 'success');
          this.getJHA();
          this.hazForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to add Analysis', 'danger');
        },
      );
  }

  onSSEFileUploadSelected(event) {
    this.sseFile = event.target.files[0] as File;
  }
  onPPEFileSelected(event) {
    this.ppeFile = event.target.files[0] as File;
  }
  DeleteCommunications(id) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.CommunicationService.deleteCommunication(id).subscribe(data => {
      });
    }
  }
  hazardDelete(haz) {
    const x = confirm('Are you sure you want to delete this Hazard Analysis?');
    if (x) {
      this.hazardService.deleteHazardAnalysis(haz.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the Hazard Analysis`, 'success');
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            this.showToast('Operation unsuccessful', 'danger');
          },
        );
    } else {
      return false;
    }
  }

  getPermits() {
    this.workpermitService.fetchWorkpermitsByTicket(this.jobTicket.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.permits = data.results;
        },
      );
  }
  getCommPlan() {
    this.CommunicationService.fetchCommunication(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        comm => {
          this.commPlan = comm.results.filter(plan => {
            return plan.site.id === this.jobTicket.site.id;
          });
        },
      );
  }


  getWorkPermits() {
    this.resourceService.fetchPermits(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.workPermits = data.results;
        },
      );
  }

  getCertificates() {
    this.resourceService.fetchTechnicianCertificate(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.certificates = data.results.filter(cert => {
            if (cert.technician !== null) {
              return cert.technician.id === this.jobTicket.assigned_to.id;
            }
          });
        },
      );
  }

  getPPEs() {
    this.resourceService.fetchSitePPEByTicket(this.jobTicket.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ppes = data.results;
        },
      );
  }


  getSEE() {
    this.resourceService.fetchSSEFilesByTicket(this.jobTicket.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.sse = data.results;
        },
      );
  }

  getJHA() {
    this.hazardService.fetchHazardAnalysisByTicket(this.jobTicket.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobHazards = data.results;
        },
      );
  }

  getIncident() {
    this.IncidentService.fetchIncidentsByTicket(this.jobTicket.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.incident = data.results;
        },
      );
  }

  // getCommunicationPlan() {
  //   this.resourceService.fetchCommunication(1000)
  //     .pipe(takeWhile(() => this.alive))
  //     .subscribe(
  //       data => {
  //         console.log(data);
  //         this.communicationPlan = data.results.filter(cp => {
  //           if (cp.ticket !== null) {
  //             return cp.ticket.id === this.jobTicket.id;
  //           }
  //         });
  //       },
  //     );
  // }

  toggle(checked: boolean) {
    this.checked = checked;
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.hod = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'HOD' || user.role.name === 'ADMIN';
          }
        });
        this.supervisor = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SUPERVISOR';
          }
        });
        this.safetyOfficer = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
        this.teamLead = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TEAM LEAD';
          }
        });
        this.technician = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TECHNICIAN';
          }
        });
        this.projectManager = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER' || user.role.name === 'TEAM LEAD';
          }
        });
      });
  }

  createApproval() {
    const modalCloseBtn = document.getElementById('close-approval');
    this.submitted = true;
    const approvalItem = 'Approval for ticket ' + this.jobTicket.ticket_code;
    const approvaldata = {
      'approver': this.loggedInUser.id,
      'requester': this.jobTicket.assigned_to.id,
      'approval_item': approvalItem,
      'comment': this.comment,
      'status': this.status,
    };
    const payload = {
      'ohs_approval': approvaldata,
    };
    this.ticketService.editTicket(this.selectedJob.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully approved the Ticket', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to approve Ticket', 'danger');
        },
      );
  }
  loadSites() {
    this.resourceService.fetchSites()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Site = data.results;
        },
      );
  }
  loadLocations() {
    return this.InductionChecklistService.fetchLocations().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Locations = data.results;
      });
  }

  loadHazards() {
    return this.hazardService.fetchHazards(50).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.hazards = data.results;
      });
  }

  editToolboxTalks() {
    const modalCloseBtn = document.getElementById('close-tbt-edit');
    this.submitted = true;
    const payload = {
      'date': this.toolboxEditForm.get('date').value,
      'ticket': this.jobTicket.id,
      'department': this.jobTicket.department,
      'agenda': this.toolboxEditForm.get('agenda').value,
      'safety_officer': this.jobTicket.safety_officer.id,
      'attendants': this.toolboxEditForm.get('attendants').value,
      'done_by': this.toolboxEditForm.get('done_by').value,

    };
    this.ToolboxTalksService.editToolboxTalk(this.selectedTBT.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Toolbox Talk', 'success');
          this.loadToolboxTalks();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Toolbox Talk', 'danger');
        },
      );
  }
  editHazard() {
    const modalCloseBtn = document.getElementById('close-haz-edit');
    this.submitted = true;
    const payload = {
      'job_hazards': this.hazEditForm.get('job_hazards').value,
      'ticket': this.jobTicket.id,
      'description': this.hazEditForm.get('description').value,
      'fire_fighter': this.hazEditForm.get('fire_fighter').value,
      'first_aider': this.hazEditForm.get('first_aider').value,
      'team_members': this.hazEditForm.get('team_members').value,
      'supervisor': this.selectedSup,
      'date': this.hazEditForm.get('date').value,
      'done_by': this.hazEditForm.get('done_by').value,

    };
    this.hazardService.editHazardAnalysis(this.selectedHazard.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully editted the Analysis', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Analysis', 'danger');
        },
      );

  }

  editIncidents() {
    const modalCloseBtn = document.getElementById('close-incident-edit');
    this.submitted = true;
    const payload = {
      'team_lead': this.selectedTeam,
      'ticket': this.jobTicket.id,
      'name_of_worker': this.incidentEditForm.get('name_of_worker').value,
      'department': this.jobTicket.department,
      'description': this.incidentEditForm.get('description').value,
      'gender': this.incidentEditForm.get('gender').value,
      'time': this.incidentEditForm.get('time').value,
      'date_of_incident': this.incidentEditForm.get('date_of_incident').value,
      'injury_to_worker': this.incidentEditForm.get('injury_to_worker').value,
      'occupation': this.incidentEditForm.get('occupation').value,
      'location_of_incident': this.selectedLoc,
      'equipment_damage': this.incidentEditForm.get('equipment_damage').value,
      'name_of_person_reporting_incident': this.incidentEditForm.get('name_of_person_reporting_incident').value,
      'primary_witness': this.incidentEditForm.get('primary_witness').value,
      'secondary_witness': this.incidentEditForm.get('secondary_witness').value,
      'immediate_action_taken': this.incidentEditForm.get('immediate_action_taken').value,
      'post_incident_action': this.incidentEditForm.get('post_incident_action').value,
      'victim_taken_to': this.incidentEditForm.get('victim_taken_to').value,
      'report_sent_by': this.loggedInUser.id,
      'report_sent_to': this.jobTicket.safety_officer.id,
      'lta': this.incidentEditForm.get('lta').value,
      'lti': this.incidentEditForm.get('lti').value,
      'non_lti': this.incidentEditForm.get('non_lti').value,



    };
    this.incidentsService.editIncidents(this.selectedIncident.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Job Incident', 'success');
          this.getIncident();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Job Incident', 'danger');
        },
      );
  }

  editSafetyInduction() {
    const modalCloseBtn = document.getElementById('close-induction-edit');
    this.submitted = true;
    const payload = {
      'date': this.inductionForm.get('date').value,
      'ticket': this.jobTicket.id,
      'activity': this.inductionForm.get('activity').value,
      'location': this.jobTicket.location.id,
      'team_lead': this.selectedTeam,
      'safety_officer': this.jobTicket.safety_officer.id,
      'attendants': this.inductionForm.get('attendants').value,
      'done_by': this.inductionForm.get('done_by').value,

    };
    this.InductionChecklistService.editSafetyInductions(this.selectedInduction.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Safety induction checklist', 'success');
          this.loadInductionchecklists();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to edit Safety induction checklist', 'danger');
        },
      );
  }

  editPPEFile(fileForm) {
    const modalCloseBtn = document.getElementById('close-ppe');
    const formData = new FormData;
    this.submitted = true;

    formData.append('ppe_names', fileForm.ppe_names);
    formData.append('safety_officer', fileForm.safety_officer);
    formData.append('ticket', fileForm.ticket);
    formData.append('file', this.ppeFile, this.ppeFile.name);
    formData.append('file_type', this.ppeFile.type);


    this.resourceService.editPPEFiles(this.selectedPPEFile.id, formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited a File', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  editSSEFile( fileForm) {
    const modalCloseBtn = document.getElementById('close-sse');
    const formData = new FormData;
    this.submitted = true;

    formData.append('name', fileForm.name);
    formData.append('ticket', fileForm.ticket);
    formData.append('site', fileForm.site);
    formData.append('safety_officer', fileForm.safety_officer);
    formData.append('file', this.sseFile, this.sseFile.name);
    formData.append('file_type', this.sseFile.type);


    this.resourceService.editSSEFiles(this.selectedSSEFile.id, formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a File', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  editCommunications() {
    const modalCloseBtn = document.getElementById('close-comm-edit');
    this.submitted = true;
    const payload = {
      'date': this.communicationEditForm.get('date').value,
      'site': this.jobTicket.site.id,
      'scope': this.jobTicket.scope.id,
      'project_manager': this.selectedPM,
      'first_aider': this.communicationEditForm.get('first_aider').value,
      'first_aider_phone': this.communicationEditForm.get('first_aider_phone').value,
      'fire_marshall': this.communicationEditForm.get('fire_marshall').value,
      'fire_marshall_phone': this.communicationEditForm.get('fire_marshall_phone').value,
      'nearest_police': this.communicationEditForm.get('nearest_police').value,
      'nearest_police_phone': this.communicationEditForm.get('nearest_police_phone').value,
      'nearest_hospital': this.communicationEditForm.get('nearest_hospital').value,
      'nearest_hospital_phone': this.communicationEditForm.get('nearest_hospital_phone').value,
      'what_do_in_an_emergency': this.communicationEditForm.get('what_do_in_an_emergency').value,
      'what_do_in_an_accident': this.communicationEditForm.get('what_do_in_an_accident').value,
      'name': this.communicationEditForm.get('name').value,
      'created_by': this.loggedInUser.id,
    };
    this.CommunicationService.editCommunication(this.selectedCommPlan.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Safety communication plan', 'success');
          this.getCommPlan();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Safety communication plan', 'danger');
        },
      );
  }

  createCommunications() {
    const modalCloseBtn = document.getElementById('close-comm-create');
    this.submitted = true;
    const payload = {
      'date': this.communicationForm.get('date').value,
      'site': this.jobTicket.site.id,
      'scope': this.jobTicket.scope.id,
      'project_manager': this.selectedPM,
      'first_aider': this.communicationForm.get('first_aider').value,
      'first_aider_phone': this.communicationForm.get('first_aider_phone').value,
      'fire_marshall': this.communicationForm.get('fire_marshall').value,
      'fire_marshall_phone': this.communicationForm.get('fire_marshall_phone').value,
      'nearest_police': this.communicationForm.get('nearest_police').value,
      'nearest_police_phone': this.communicationForm.get('nearest_police_phone').value,
      'nearest_hospital': this.communicationForm.get('nearest_hospital').value,
      'nearest_hospital_phone': this.communicationForm.get('nearest_hospital_phone').value,
      'what_do_in_an_emergency': this.communicationForm.get('what_do_in_an_emergency').value,
      'what_do_in_an_accident': this.communicationForm.get('what_do_in_an_accident').value,
      'name': this.communicationForm.get('name').value,
      'created_by': this.loggedInUser.id,
    };
    this.CommunicationService.createCommunication(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created the Safety communication plan', 'success');
          this.getCommPlan();
          this.communicationForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to create Safety communication plan', 'danger');
        },
      );
  }
  changeCommunicationPlan(safety: CommunicationPlan) {
    this.communicationEditForm.patchValue({
      'date': this.datePipe.transform(safety.date, 'yyyy-MM-ddTHH:mm') ,
      'location': safety.location === null ? '' : safety.location.id,
      'site': safety.site === null ? '' : safety.site.id,
      'scope': safety.scope === null ? '' : safety.scope.id,
      'project_manager': safety.project_manager === null ? '' : safety.project_manager.id,
      'first_aider': safety.first_aider,
      'first_aider_phone': safety.first_aider_phone,
      'fire_marshall': safety.fire_marshall,
      'fire_marshall_phone': safety.fire_marshall_phone,
      'nearest_police': safety.nearest_police,
      'nearest_police_phone': safety.nearest_police_phone,
      'nearest_hospital': safety.nearest_hospital,
      'nearest_hospital_phone': safety.nearest_hospital_phone,
      'what_do_in_an_emergency': safety.what_do_in_an_emergency,
      'what_do_in_an_accident': safety.what_do_in_an_accident,
      'name': safety.name,
      'created_by': safety.created_by,
    });
  }

  openImage(dialog6: TemplateRef<any>, equip) {
    this.dialogService.open(dialog6, { context: 'this is some additional data passed to dialog' });
    this.selectedEquipment = equip;
  }


  openApproval(dialog5: TemplateRef<any>, job) {
    if (job.safety_officer !== null && job.safety_officer.id === this.loggedInUser.id) {
      this.dialogService.open(dialog5, { context: 'this is some additional data passed to dialog' });
      this.selectedJob = job;
    } else {
      this.showToast('You do not have authorization to perform this action. Please contact the Admin for help', 'warning');
    }
  }
  openTBT(dialog7: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog7, { context: 'this is some additional data passed to dialog' });
    }, 2000);
    this.loadDepts();
    this.getAllUsers();
    this.loadAttendants();
  }
  openPPEFileModal(dialog8: TemplateRef<any>) {
    this.getAllUsers();
    this.getPPENames();
    setTimeout(() => {
      this.dialogService.open(dialog8, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }
  openSSEFileModal(dialog9: TemplateRef<any>) {
    this.getSSENames();
    this.getAllUsers();
    this.loadSites();
    setTimeout(() => {
      this.dialogService.open(dialog9, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }
  openAttendants(dialog10: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog10, { context: 'this is some additional data passed to dialog' });
    }, 1000);  }
  openHazform(dialog11: TemplateRef<any>) {
    this.dialogService.open(dialog11, { context: 'this is some additional data passed to dialog' });
    this.loadAttendants();
    this.loadHazards();
    this.getAllUsers();
  }

  openIncidents(dialog13: TemplateRef<any>) {
    this.dialogService.open(dialog13, { context: 'this is some additional data passed to dialog' });
    this.loadDepts();
    this.getAllUsers();
    this.loadLocations();
    this.loadTickets();
  }

  openSafetyInduction(dialog12: TemplateRef<any>) {
    this.dialogService.open(dialog12, { context: 'this is some additional data passed to dialog' });
    this.getAllUsers();
    this.loadAttendants();
  }

  editPPEFileModal(dialog15: TemplateRef<any>, item) {
    this.getPPENames();
    this.selectedPPEFile = item;
    this.dialogService.open(dialog15, { context: 'this is some additional data passed to dialog' });
  }
  editSSEFileModal(dialog16: TemplateRef<any>, item) {
    this.getSSENames();
    this.selectedSSEFile = item;
    this.dialogService.open(dialog16, { context: 'this is some additional data passed to dialog' });
  }
  openCommPlan(dialog20: TemplateRef<any>) {
    this.dialogService.open(dialog20, { context: 'this is some additional data passed to dialog' });
    this.getAllUsers();
  }
  editCommPLan(dialog21: TemplateRef<any>, comm) {
    this.selectedCommPlan = comm;
    this.dialogService.open(dialog21, { context: 'this is some additional data passed to dialog' });
    this.getAllUsers();
    this.changeCommunicationPlan(comm);

  }

  DeleteToolboxTalks(id) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.ToolboxTalksService.deleteToolboxTalk(id).subscribe(data => {
        this.loadToolboxTalks();
      });
    }
  }

  DeleteInductionChecklist(id) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.InductionChecklistService.deleteSafetyInductions(id).subscribe(data => {
        this.loadInductionchecklists();
      });
    }
  }


  safetyOfficerApproval() {
    const modalCloseBtn = document.getElementById('close-approval');
    this.submitted = true;
    const approvalItem = 'Approval for PTW ' + this.ptw.work_permit;
    const payload = {
      'approval': {
        'comment': this.comment,
        'status': this.status,
        'approval_item': approvalItem,
        'approver': this.loggedInUser.id,
        'requester': this.jobTicket.assigned_to.id,
      },
    };
    this.resourceService.editPTW(this.ptw.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully submitted your approval', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to approve', 'danger');
        },
      );
  }
  back() {
    this._location.back();
    return false;
  }

  getColor(rating) {
    switch (rating) {
      case 3:
        return 'red';
      case 2:
        return 'orange';
      case 1:
        return 'blue';
    }
  }

  openSafetyReview(dialog1: TemplateRef<any>, perm: any) {

    if (perm.safety_officer !== null && perm.safety_officer.id === this.loggedInUser.id) {
      this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
      this.ptw = perm;
    } else {
      this.showToast('You do not have authorization to perform this action. Please contact the Admin for help', 'warning');
    }

  }


  openPTWEdit(dialog2: TemplateRef<any>, perm: any) {
    this.getAllUsers();
    this.getWorkPermits();
    this.ptw = perm;
    setTimeout(() => {
      this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
    }, 1000);
    this.changePermit(perm);
  }
  changeJobIncident(incident: JobIncidents) {
    this.incidentEditForm.patchValue({
      'team_lead': incident.team_lead === null ? '' : incident.team_lead.id,
      'ticket': incident.ticket === null ? '' : incident.ticket.id,
      'name_of_worker': incident.name_of_worker,
      'department': incident.department === null ? '' : incident.department.id,
      'description': incident.description,
      'gender': incident.gender,
      'time': this.datePipe.transform(incident.time, 'yyyy-MM-ddTHH:mm'),
      'date_of_incident':  this.datePipe.transform(incident.date_of_incident, 'yyyy-MM-ddTHH:mm'),
      'injury_to_worker': incident.injury_to_worker,
      'occupation': incident.occupation,
      'location_of_incident': incident.location_of_incident === null ? '' : incident.location_of_incident.id,
      'equipment_damage': incident.equipment_damage,
      'name_of_person_reporting_incident': incident.name_of_person_reporting_incident,
      'primary_witness': incident.primary_witness,
      'secondary_witness': incident.secondary_witness,
      'immediate_action_taken': incident.immediate_action_taken,
      'post_incident_action': incident.post_incident_action,
      'victim_taken_to': incident.victim_taken_to,
      'report_sent_by': incident.report_sent_by === null ? '' : incident.report_sent_by.id,
      'report_sent_to': incident.report_sent_to === null ? '' : incident.report_sent_to.id,
      'lta': incident.lta,
      'lti': incident.lti,
      'non_lti': incident.non_lti,
    });
  }

  editPermit() {
    const modalCloseBtn = document.getElementById('close-perm');
    this.submitted = true;
    const payload = {
      'hod': this.selectedHOD,
      'project_manager': this.selectedPM,
      'supervisor': this.selectedSup,
      'permits': this.permitForm.get('permits').value,
      'safety_access': this.permitForm.get('safety_access').value,
      'safety_or_concerns': this.permitForm.get('safety_or_concerns').value,
    };
    this.resourceService.editPTW(this.ptw.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Permit to work', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Permit to work', 'danger');
        },
      );
  }


  changePermit(perm: Workpermit) {
    this.permitForm.patchValue({
      hod: perm.hod === null ? '' : perm.hod.id,
      project_manager: perm.project_manager === null ? '' : perm.project_manager.id,
      supervisor: perm.supervisor === null ? '' : perm.supervisor.id,
      permits: perm.permits === null ? '' : perm.permits.id,
      safety_access: perm.safety_access,
      safety_or_concerns: perm.safety_or_concerns,
      communication_plan: perm.communication_plan === null ? '' : perm.communication_plan.id,
    });
  }

  changeToolboxTalks(toolbox: ToolBoxTalks) {
    this.toolboxEditForm.patchValue({
      'date': this.datePipe.transform(toolbox.date, 'yyyy-MM-ddTHH:mm') ,
      'ticket': toolbox.ticket === null ? '' : toolbox.ticket.id,
      'department': toolbox.department === null ? '' : toolbox.department.id,
      'safety_officer': toolbox.safety_officer === null ? '' : toolbox.safety_officer.id,
      'agenda': toolbox.agenda,
      'done_by': toolbox.done_by,
    });

  }
  changeHazard(haz: HazardAnalysis) {
    this.hazEditForm.patchValue({
      job_hazards: haz.job_hazards === null ? '' : haz.job_hazards.id,
      ticket: haz.ticket === null ? '' : haz.ticket.id,
      description: haz.description,
      fire_fighter: haz.fire_fighter,
      first_aider: haz.first_aider,
      team_members: haz.team_members === null ? '' : haz.team_members.id,
      supervisor: haz.supervisor,
      date: this.datePipe.transform(haz.date, 'yyyy-MM-ddTHH:mm'),
      done_by: haz.done_by,
    });
  }

  changeSafetyInductions(induction: SafetyInduction) {
    this.inductionEditForm.patchValue({
      'date': this.datePipe.transform(induction.date, 'yyyy-MM-ddTHH:mm') ,
      'ticket': induction.ticket === null ? '' : induction.ticket.id,
      'activity': induction.activity,
      'location': induction.location === null ? '' : induction.location.id,
      'team_lead': induction.team_lead === null ? '' : induction.team_lead.id,
      'safety_officer': induction.safety_officer === null ? '' : induction.safety_officer.id,
      'done_by': induction.done_by,

    });

  }

  openHazEditform(dialog17: TemplateRef<any>, haz) {
    setTimeout(() => {
      this.dialogService.open(dialog17, { context: 'this is some additional data passed to dialog' });
    }, 1000);
    this.selectedHazard = haz;
    this.loadTickets();
    this.changeHazard(haz);
    this.loadAttendants();
  }
  openInductionEdit(dialog19: TemplateRef<any>, induction) {
    this.dialogService.open(dialog19, { context: 'this is some additional data passed to dialog' });
    this.loadTickets();
    this.loadAttendants();
    this.changeSafetyInductions(induction);
    this.selectedInduction = induction;
  }

  openIncidentsEdit(dialog18: TemplateRef<any>, incident) {
    this.dialogService.open(dialog18, { context: 'this is some additional data passed to dialog' });
    this.changeJobIncident(incident);
    this.loadTickets();
    this.selectedIncident = incident;
  }

  openToolboxEdit(dialog14: TemplateRef<any>, toolbox) {
    this.dialogService.open(dialog14, { context: 'this is some additional data passed to dialog' });
    this.loadTickets();
    this.loadAttendants();
    this.changeToolboxTalks(toolbox);
    this.selectedTBT = toolbox;
  }

  selectedInductionChecklist(id) {
    localStorage.setItem('selectedInductionChecklist', id);
  }

  selectedToolboxChecklist(id) {
    localStorage.setItem('selectedToolboxChecklist', id);
  }


  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
      });
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
  identify(index, item) {
    return item.id;
  }

  flush() {

    this.ppeForm.reset();
    this.sseForm.reset();
    this.inductionForm.reset();
    this.hazForm.reset();
    this.communicationForm.reset();
    this.incidentForm.reset();
    this.toolboxForm.reset();


  }
}
