import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { TaskService } from '../../../../../../@core/services/task.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../../../@core/services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Task } from '../../../../../../@core/models/task';
import { TaskDetailService } from '../../../../../../@core/services/task-detail.service';
import { FileService } from '../../../../../../@core/services/files.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'ngx-subtask',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.scss'],
})

export class SubTaskComponent implements OnInit, OnDestroy {

  alive = true;

  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;

  submitted = false;
  searchTerm;

  subtasks = [];
  subtaskEditForm: FormGroup;
  site;
  siteTeams = [];
  teams = [];
  taskManager = [];
  kpis = [];
  files = [];
  comments = [];

  taskId;
  showComments = false;
  showFiles = false;
  subtask;
  selectedTask;
  userDetails;
  noImage = null;

  taskDateCompleted;


  constructor(
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    protected location: Location,
    private taskService: TaskService,
    private toastr: NbToastrService,
    private userService: UserService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private taskDetailService: TaskDetailService,
    private fileService: FileService,
  ) {
    this.taskId = +this.route.snapshot.paramMap.get('id');
    this.loggedInUser = jwt_decode(this.userToken);
  }

  ngOnInit() {
    this.taskService.refresh$.subscribe(
      () => {
        this.getTask();
        this.getKPIs();
      },
    );
    this.getTask();
    this.getKPIs();
    this.transformDate();

    this.subtaskEditForm = this.fb.group({
      name: ['', Validators.required],
      assign: ['', Validators.required],
      kpi: ['', Validators.required],
    });
  }

  getTask() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.taskService.fetchSpecificsubTasks(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.subtasks = data.results;
        },
      );
  }

  getUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.taskManager = data.results.filter(user => {
          if (user.role !== null) {
            // if (user.role !== null && this.loggedInUser.division === user.division.name) {
            return user.role.name === 'TECHNICIAN';
          }
        });
      });
  }



  getUserProfile(id) {
    this.userService.fetchOneProfile(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.userDetails = data;
      });
  }

  getKPIs() {
    this.taskService.fetchKPI()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.kpis = data.results;
        },
      );
  }


  saveTask(taskForm) {
    const modalCloseBtn = document.getElementById('close-task');
    this.submitted = true;

    const payload = {
      'name': taskForm.name,
      'assign': taskForm.assign,
      'kpi': taskForm.kpi,
      'task': this.taskId,
      'status': 'todo',
    };

    this.taskService.createSubTask(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a Subtask', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('Unable to create subtask', 'danger');
        },
      );
  }

  savekpi(kpiForm) {
    this.submitted = true;

    const payload = {
      'name': kpiForm.name,
      'number_of_days': kpiForm.number_of_days,
    };

    this.taskService.createKPI(payload)
      .subscribe(
        () => {
          this.submitted = false;
          this.showToast('You have successfully added a KPI', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Error', 'danger');
        },
      );
  }

  endTask(subtask) {
    const payload = {
      'end_date': this.taskDateCompleted,
    };
    this.taskService.editSubTask(subtask.id, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully Ended the subtask', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to End subtask', 'danger');
        },
      );
  }

  viewComments(subtask) {
    this.showComments = true;
    this.showFiles = false;
    this.subtask = subtask;

    this.taskDetailService.fetchSubtaskComment(subtask.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.comments = data.results;
        },
      );
  }

  viewFiles(subtask) {
    this.showFiles = true;
    this.showComments = false;
    this.subtask = subtask;

    this.fileService.fetchSubtaskFiles(subtask.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.files = data.results;
        },
      );
  }


  changeTask(subtask: Task) {

    if (subtask.assign === null) {
      this.subtaskEditForm.patchValue({
        name: subtask.name,
        assign: '',
        kpi: subtask.kpi.id,
      });
    } else if (subtask.kpi === null) {
      this.subtaskEditForm.patchValue({
        name: subtask.name,
        assign: subtask.assign.id,
        kpi: '',
      });
    } else {
      this.subtaskEditForm.patchValue({
        name: subtask.name,
        assign: subtask.assign.id,
        kpi: subtask.kpi.id,
      });
    }

  }

  editSubtask() {
    const modalCloseBtn = document.getElementById('close-task');
    this.submitted = true;
    const payload = {
      'name': this.subtaskEditForm.get('name').value,
      'assign': this.subtaskEditForm.get('assign').value,
      'kpi': this.subtaskEditForm.get('kpi').value,
    };

    this.taskService.editSubTask(this.selectedTask.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the SubTask', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to edit subtask', 'danger');
        },
      );
  }

  confirmDelete(subtask) {
    const x = confirm('Are you sure you want to remove this subtask?');
    if (x) {
      this.removeTask(subtask);
    } else {
      return false;
    }
  }

  removeTask(subtask) {
    this.taskService.deleteSubTask(subtask.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Removed the SubTask`, 'success');
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Operation unsuccessful', 'danger');
        },
      );
  }

  transformDate() {
    this.taskDateCompleted = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }

  closeComments() {
    this.showComments = false;
  }

  closeFiles() {
    this.showFiles = false;
  }


  back() {
    this.location.back();
    return false;
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  uploadTaskForm(dialog: TemplateRef<any>) {
    this.getUsers();
    setTimeout(() => {
      this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    }, 2000);
  }

  editTaskForm(subtask, dialog1: TemplateRef<any>) {
    this.getUsers();
    this.selectedTask = subtask;
    this.changeTask(subtask);
    setTimeout(() => {
      this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    }, 2000);
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
