import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { CommunicationPlanService } from '../../../@core/services/communication-plan.service';
import {Location} from '@angular/common';
import { ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import { ToolboxService } from '../../../@core/services/toolbox.service';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import * as jwt_decode from 'jwt-decode';
import {UserService} from '../../../@core/services/user.service';

@Component({
  selector: 'ngx-communicationplan-edit',
  templateUrl: './communicationplan-edit.component.html',
  styleUrls: ['./communicationplan-edit.component.scss'],
})
export class CommunicationplanEditComponent implements OnInit {

  communicationForm: FormGroup;
  public SelectedTbtTicket: number;
  Tickets: any;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  alive = true;
  public projectManager = [];
  public commId: any;
  keywordPM = 'first_name';
  public selectedPM: any;


  constructor( public  commService: CommunicationPlanService,
               protected _location: Location,
               public modalCtrl: ModalController,
               private fb: FormBuilder,
               public toolboxService: ToolboxService,
               private toastr: NbToastrService,
               private userService: UserService,


  ) {
    this.loggedInUser = jwt_decode(this.userToken);

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
  }

  ngOnInit() {
    this.loadTickets();
    this.getAllUsers();

  }
  selectPM(item) {
    // do something with selected item
    this.selectedPM = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocusedPM(e) {
    // do something when input is focused
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.projectManager = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER';
          }
        });
      });
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
  editCommunications() {
    const payload = {
      'date': this.communicationForm.get('date').value,
      'site': this.Tickets[0].site.id,
      'scope':  this.Tickets[0].scope.id,
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
    this.commId = localStorage.getItem('commPlan');
    this.commService.editCommunication(this.commId, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully edited the Safety communication plan', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Safety communication plan', 'danger');
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
