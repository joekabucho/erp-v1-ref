import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { SiteInspectionService } from '../../../@core/services/site-inspection.service';
import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../@core/services/user.service';
import * as jwt_decode from 'jwt-decode';
import { ModalController} from '@ionic/angular';

@Component({
  selector: 'ngx-site-inspaection-edit',
  templateUrl: './site-inspaection-edit.component.html',
  styleUrls: ['./site-inspaection-edit.component.scss'],
})
export class SiteInspaectionEditComponent implements OnInit {
  keywordSite = 'name';
  public selectedSite: any;
  alive = true;
  inspectionEditForm: FormGroup;
  selectedSiteInspection: any;
  allUsers: any;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  Sites = [];
  constructor(
                  private fb: FormBuilder,
                  private inspectionService: SiteInspectionService,
                  private toastr: NbToastrService,
                  private userService: UserService,
                  public modalCtrl: ModalController) {
    this.inspectionEditForm = this.fb.group({
      'date': [null, Validators.required],
      'ref_number': [null, Validators.required],
      'site': [null, Validators.required],
      'contractor': [null, Validators.required],
      'site_engineer': [null, Validators.required],
      'work_description': [null, Validators.required],
      'ppe': [null, Validators.required],
      'risk_treatment': [null, Validators.required],
      'compliance_to_safaricom': [null, Validators.required],
      'provision_of_work_equipment': [null, Validators.required],
      'emergency_response': [null, Validators.required],
    });
    this.loggedInUser = jwt_decode(this.userToken);
  }

  ngOnInit() {
    this.getAllUsers();
    this.loadSites();
  }


  selectSite(item) {
    // do something with selected item
    this.selectedSite = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocusedSite(e) {
    // do something when input is focused
    this.loadSites();
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.allUsers = data.results;
      });
  }

  loadSites() {
    return this.inspectionService.fetchSites().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Sites = data.results;
      });
  }

  saveSiteInspection() {
    const payload = {
      'date': this.inspectionEditForm.get('date').value,
      'ref_number': this.inspectionEditForm.get('ref_number').value,
      'site': this.selectedSite,
      'contractor': this.inspectionEditForm.get('contractor').value,
      'site_engineer': this.inspectionEditForm.get('site_engineer').value,
      'work_description': this.inspectionEditForm.get('work_description').value,
      'ppe': this.inspectionEditForm.get('ppe').value,
      'risk_treatment': this.inspectionEditForm.get('risk_treatment').value,
      'compliance_to_safaricom': this.inspectionEditForm.get('compliance_to_safaricom').value,
      'provision_of_work_equipment': this.inspectionEditForm.get('provision_of_work_equipment').value,
      'emergency_response': this.inspectionEditForm.get('emergency_response').value,
      'created_by': this.loggedInUser.id,
    };
    this.selectedSiteInspection = localStorage.getItem('inspection');
    this.inspectionService.editSiteInspection(this.selectedSiteInspection, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully edited the Site Inspection', 'success');
        },
        (error: HttpErrorResponse) => {
          // modalCloseBtn.click();
          this.showToast('Unable to edit Site Inspection', 'danger');

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
