import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { ToolboxService } from '../../../@core/services/toolbox.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UserService} from '../../../@core/services/user.service';


@Component({
  selector: 'ngx-tbt-edit',
  templateUrl: './tbt-edit.component.html',
  styleUrls: ['./tbt-edit.component.scss'],
})
export class TbtPageEditComponent implements OnInit {
  keywordTicket = 'ticket_code';
  keywordSO = 'first_name';
  keywordDep = 'name';
  Tickets: any;
  attendants = [];
  public SelectedTbtTicket: number;
  public toolboxForm: FormGroup;
  Date;

  alive = true;
  public allattendants: any;
  public editId: any;
  public Department = [];
  public safetyOfficer = [];


  public selectedTicket: any;
  public selectedSO: any;
  public selectedDep: any;
  constructor(
    public modalCtrl: ModalController,
    public toolboxService: ToolboxService,
    private toastr: NbToastrService,
    private fb: FormBuilder,
    private userService: UserService,


  ) {
    this.toolboxForm = this.fb.group({
      'date': this.Date,
      'ticket': [null, Validators.required],
      'agenda': [null, Validators.required],
      'done_by': [null, Validators.required],
      'safety_officer': [null, Validators.required],
      'attendants': this.allattendants,
    });
  }

  ngOnInit() {
    this.loadAttendants();
    this.loadTickets();
    this.loadDepartment();
    this.getAllUsers();
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  selectedTicketID(item) {
    // do something with selected item
    this.selectedTicket = item.id;
  }
  selectSO(item) {
    // do something with selected item
    this.selectedSO = item.id;
  }
  selectDep(item) {
    // do something with selected item
    this.selectedDep = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedDepartment(e) {
    // do something when input is focused
    this.loadDepartment();
  }
  onFocusedTickets(e) {
    // do something when input is focused
    this.loadTickets();
  }
  onFocusedSo(e) {
    // do something when input is focused
    this.getAllUsers();
  }

  loadTickets() {
    return this.toolboxService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results;
      });
  }
  editToolboxTalks() {
    const modalCloseBtn = document.getElementById('close-edit');
    const payload = {
      'date': this.toolboxForm.get('date').value,
      'ticket': this.selectedTicket,
      'department': this.selectedDep,
      'agenda': this.toolboxForm.get('agenda').value,
      'safety_officer': this.selectedSO,
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

  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.safetyOfficer = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
      });
  }
  loadAttendants() {
    return this.toolboxService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
  }

  loadDepartment() {
    return this.toolboxService.fetchDepartments().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Department = data.results;
      });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

}
