import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { ResourceService } from '../../../@core/services/ohs-resource.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../@core/services/user.service';



@Component({
  selector: 'ngx-permit-create-modal',
  templateUrl: './permit-create-modal.component.html',
  styleUrls: ['./permit-create-modal.component.scss'],
})
export class PermitCreateModalComponent implements OnInit {
 alive = true;
  public workpermitForm: FormGroup;
  public editId: any;
  public permits = [];
  public Supervisor = [];
  public projectManager = [];
  public HOD = [];
  public selectedWorkPermits: any;

  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              private fb: FormBuilder,
              public resourceService: ResourceService,
              private userService: UserService,

  ) {
    this.workpermitForm = this.fb.group({
      'safety_or_concerns': [null],
      'safety_access': [null],
      'project_manager': [null],
      'hod': [null],
      'supervisor': [null],
      'permits': this.selectedWorkPermits,


    });
  }

  ngOnInit() {
    this.loadPermits();
    this.getAllUsers();
  }

  loadPermits() {
    return this.resourceService.fetchPermits(1000).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.permits = data.results;
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
        this.HOD = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'ADMIN' || user.role.name === 'HOD';
          }
        });
        this.projectManager = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER';
          }
        });
      });
  }

  editPermit() {

    const payload = {
      'hod': this.workpermitForm.get('hod').value,
      'project_manager': this.workpermitForm.get('project_manager').value,
      'supervisor': this.workpermitForm.get('supervisor').value,
      'permits': this.workpermitForm.get('permits').value,
      'safety_access': this.workpermitForm.get('safety_access').value,
      'safety_or_concerns': this.workpermitForm.get('safety_or_concerns').value,
    };
    let ptwInt;
    ptwInt = localStorage.getItem('selectedPTW');
    this.editId = +ptwInt;
    this.resourceService.editPTW(this.editId, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully edited the Permit to work', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Permit to work', 'danger');
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
