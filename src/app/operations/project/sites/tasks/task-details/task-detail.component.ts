import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TaskService } from '../../../../../@core/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TaskDetailService } from '../../../../../@core/services/task-detail.service';
import * as jwt_decode from 'jwt-decode';
import { FileService } from '../../../../../@core/services/files.service';
import { UserService } from '../../../../../@core/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Task } from '../../../../../@core/models/task';


@Component({
  selector: 'ngx-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})

export class TaskDetailComponent implements OnInit, OnDestroy {

  alive = true;
  submitted = false;
  show = false;

  userToken = localStorage.getItem('currentUserToken');
  loggedInUser;

  task;

  taskDateCompleted;
  notComplete = null;

  comments: any = [];
  files: any = [];
  fileType: any = [];
  numberInputs: any = [];
  numberFields: any = [];
  metrics: any = [];

  kpis = [];
  taskManager = [];
  safetyOfficials = [];

  erpFile: File = null;

  taskEditForm: FormGroup;


  userDetails: any;
  safetyOfficerProfile: any;
  noImage = null;

  taskId;

  public priorities = ['urgent', 'important', 'medium', 'low'];


  constructor(
    protected location: Location,
    private dialogService: NbDialogService,
    private taskService: TaskService,
    private taskDetailService: TaskDetailService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: NbToastrService,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
    this.taskId = +this.route.snapshot.paramMap.get('id');

  }

  back() {
    this.location.back();
    return false;
  }

  ngOnInit() {
    this.taskService.refresh$.subscribe(
      () => {
        this.getTask();
        this.getKPIs();
      },
    );
    this.taskDetailService.refresh$.subscribe(
      () => {
        this.getNumbers();
        this.getComment();
        this.getFieldName();
        this.getMetrics();
      },
    );
    this.fileService.refresh$.subscribe(
      () => {
        this.getFiles();
        this.getFileType();
      },
    );
    this.getTask();
    this.transformDate();
    this.getFieldName();
    this.taskEditForm = this.fb.group({
      name: ['', Validators.required],
      assign: ['', Validators.required],
      kpi: ['', Validators.required],
      priority: ['', Validators.required],
      safety_officer: ['', Validators.required],
    });
  }


  getTask() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.taskService.fetchOneTask(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.task = data;
          this.task.due_date = new Date(this.calcEndDate(this.task.date_started, this.task.kpi.number_of_days));
          this.task.days_running = this.calcDaysDiff(this.task.date_started);
          this.getUserProfile(this.task.assign.id);
          this.task.safety_officer === null ? '' : this.getSafetyOfficerProfile(this.task.safety_officer.id);
          this.getFiles();
          this.getNumbers();
          this.getComment();
        },
      );
  }

  getUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.taskManager = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER' || user.role.name === 'TECHNICIAN';
          }
        });
        this.safetyOfficials = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
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

  getUserProfile(id) {
    this.userService.fetchOneProfile(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.userDetails = data;
      });
  }

  getSafetyOfficerProfile(id) {
    this.userService.fetchOneProfile(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.safetyOfficerProfile = data;
      });
  }



  getFiles() {
    this.fileService.fetchTaskFiles(this.taskId)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.files = data.results;
        },
      );
  }

  getFileType() {
    this.fileService.fetchFileTypes()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.fileType = data.results;
        },
      );
  }


  getNumbers() {
    this.taskDetailService.fetchNumberInput()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.numberInputs = data.results.filter(item => {
            return item.task === this.task.id;
          });
        },
      );
  }

  getComment() {
    this.taskDetailService.fetchTaskComment(this.taskId)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.comments = data.results;
          this.comments.forEach(com => {
            this.getUserProfile(com.posted_by.id);
          });
        },
      );
  }

  getFieldName() {
    this.taskDetailService.fetchFieldName()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.numberFields = data.results;
        },
      );
  }

  getMetrics() {
    this.taskDetailService.fetchMetrics()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.metrics = data.results;
        },
      );
  }


  endTask() {
    const payload = {
      'end_date': this.taskDateCompleted,
    };
    this.taskService.editTask(this.task.id, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully Ended the task', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to End task', 'danger');
        },
      );
  }

  saveNumber(numberForm) {
    const modalCloseBtn = document.getElementById('close-num');

    this.submitted = true;

    const payload = {
      'number': numberForm.number,
      'field_name': numberForm.field_name,
      'metric': numberForm.metric,
      'posted_by': this.loggedInUser.id,
      'task': this.task.id,
      'subtask': null,
    };

    this.taskDetailService.createNumberInput(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added the information', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('Error', 'danger');
        },
      );
  }

  saveNumFieldName(fieldForm) {
    this.submitted = true;

    const payload = {
      'name': fieldForm.name,
    };

    this.taskDetailService.createFieldName(payload)
      .subscribe(
        () => {
          this.submitted = false;
          this.showToast('You have successfully added the information', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Error', 'danger');
        },
      );
  }

  saveMet(metForm) {
    this.submitted = true;

    const payload = {
      'name': metForm.name,
      'InputNumberType': metForm.field_name,
    };

    this.taskDetailService.createMetrics(payload)
      .subscribe(
        () => {
          this.submitted = false;
          this.showToast('You have successfully added the information', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Error', 'danger');
        },
      );
  }

  onErpFileSelected(event) {
    this.erpFile = event.target.files[0] as File;
  }

  saveFile(fileForm, dialog1) {
    const modalCloseBtn = document.getElementById('close-file');
    const formData = new FormData;
    this.submitted = true;

    formData.append('name', this.erpFile.name);
    formData.append('upload_type', this.erpFile.type);
    formData.append('file', this.erpFile, this.erpFile.name);
    formData.append('file_type', fileForm.file_type);
    formData.append('comment', fileForm.comment);
    formData.append('posted_by', this.loggedInUser.id);
    formData.append('task', this.task.id);

    this.fileService.createFile(formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a File', 'success');
          setTimeout(() => {
            this.openNumberModal(dialog1);
          }, 3000);
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );

  }

  saveFileType(fTypeForm) {
    this.submitted = true;

    const payload = {
      'name': fTypeForm.name,
    };

    this.fileService.createFileType(payload)
      .subscribe(
        () => {
          this.submitted = false;
          this.showToast('You have successfully added the information', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Error', 'danger');
        },
      );
  }

  saveNumFile(numberForm) {
    const payload = {
      'number': numberForm.number,
      'field_name': 5,
      'metric': 4,
      'posted_by': this.loggedInUser.id,
      'task': this.task.id,
      'subtask': null,
    };

    this.taskDetailService.createNumberInput(payload)
      .subscribe(
        () => {
          this.showToast('You have successfully added the Amount', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('No Amount was inputed', 'warning');
        },
      );
  }

  saveComment(commentForm) {
    this.submitted = true;

    const payload = {
      'comment': commentForm.name,
      'posted_by': this.loggedInUser.id,
      'task': this.task.id,
    };

    this.taskDetailService.createComment(payload)
      .subscribe(
        () => {
          this.submitted = false;
          commentForm.resetForm();
          this.showToast('You have successfully added a Comment', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          commentForm.resetForm();
          this.showToast('Error', 'danger');
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
          this.showToast('Unable to save kpi', 'danger');
        },
      );
  }

  editTask() {
    const modalCloseBtn = document.getElementById('close-task');
    this.submitted = true;
    const payload = {
      'name': this.taskEditForm.get('name').value,
      'assign': this.taskEditForm.get('assign').value,
      'kpi': this.taskEditForm.get('kpi').value,
      'priority': this.taskEditForm.get('priority').value,
      'safety_officer': this.taskEditForm.get('safety_officer').value,
    };

    this.taskService.editTask(this.task.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Task', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit task', 'danger');
        },
      );
  }

  showComments() {
    this.show = !this.show;
  }

  transformDate() {
    this.taskDateCompleted = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }

  calcDaysDiff(dateStarted) {
    const date1: any = new Date(dateStarted);
    const date2: any = new Date;
    const diffInDays = Math.abs(Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)));
    return diffInDays;
  }

  calcEndDate(dateStarted, expectedDays) {
    const date1: any = new Date(dateStarted);
    const end_date = date1.setDate(date1.getDate() + expectedDays);
    return end_date;
  }


  editTaskForm(dialog2: TemplateRef<any>) {
    this.getUsers();
    this.getKPIs();
    setTimeout(() => {
      this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
    }, 1500);
    this.changeTask(this.task);
  }

  changeTask(task: Task) {

    this.taskEditForm.patchValue({
      name: task.name,
      assign: task.assign === null ? '' : task.assign.id,
      kpi: task.kpi === null ? '' : task.kpi.id,
      priority: task.priority,
      safety_officer: task.safety_officer === null ? '' : task.safety_officer.id,
    });

  }

  viewSubtasks() {
    this.router.navigate([`/operations/subtasks/${this.task.id}`]);
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  openFileModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    this.getFileType();
  }

  openNumberModal(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    this.getMetrics();
  }


  ngOnDestroy() {
    this.alive = false;
  }


}
