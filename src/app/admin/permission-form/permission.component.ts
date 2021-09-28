import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { UserService } from '../../@core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NbComponentStatus, NbToastrService, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent implements OnInit, OnDestroy {

  alive = true;
  submitted = false;
  show = false;
  roles = [];
  contentTypes = [];
  selectedRole: any;

  fetchedRole: any;
  fetchedContent: any;


  keyword = 'name';
  keywordContentType = 'model';


  constructor(
    private userService: UserService,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.userService.refresh$.subscribe(
      () => {
        this.getRoles();
        this.getContent();

      },
    );
    this.getRoles();
    this.getContent();
  }

  getRoles() {
    this.userService.fetchRole()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.roles = data.results;
        },
      );
  }

  selectEvent(item) {
    // do something with selected item
    this.fetchedRole = item;
  }
  selectContentEvent(item) {
    // do something with selected item
    this.fetchedContent = item;
  }

  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something
  }


  getContent() {
    this.userService.fetchContentType()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.contentTypes = data;
        },
      );
  }


  onSubmit(roleForm) {
    const payload = {
      'name': roleForm.name,
    };
    const modalCloseBtn = document.getElementById('close-role');

    this.submitted = true;

    this.userService.createRole(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(`You have successfully added a role`, 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  addPermission(permForm) {
    const payload = {
      'role': this.fetchedRole.id,
      'content_type': this.fetchedContent.id,
      'View': permForm.View === undefined || permForm.View === null ? false : true,
      'Edit': permForm.Edit === undefined || permForm.Edit === null ? false : true,
      'Create': permForm.Create === undefined || permForm.Create === null ? false : true,
      'Delete': permForm.Delete === undefined || permForm.Delete === null ? false : true,
      'Approver': permForm.Approver === undefined || permForm.Approver === null ? false : true,
      'Is_superuser': permForm.Is_superuser === undefined || permForm.Is_superuser === null ? false : true,
    };

    this.submitted = true;

    this.userService.createPermission(payload)
      .subscribe(
        () => {
          this.submitted = false;
          permForm.resetForm();
          this.showToast(`You have successfully added a permission`, 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          permForm.resetForm();
          this.showToast(error.error.errors.name, 'danger');
        },
      );

  }

  confirmDelete(role) {
    const x = confirm('Are you sure you want to delete this role?');
    if (x) {
      this.removeRole(role);
    } else {
      return false;
    }
  }

  removeRole(role) {
    this.userService.deleteRole(role.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Deleted the Role`, 'success');
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Operation unsuccessful', 'danger');
        },
      );
  }

  removePerssion(perm) {
    const sideCloseBtn = document.getElementById('close-side');

    this.userService.deletePermission(perm.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Deleted the permission`, 'success');
          sideCloseBtn.click();
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Operation unsuccessful', 'danger');
        },
      );
  }

  viewDetails(role) {
    this.show = true;
    this.selectedRole = role;
  }

  closeSide() {
    this.show = false;
  }

  showRoleForm(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
