import { Component, OnDestroy, TemplateRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { takeWhile } from 'rxjs/operators';
import { NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TaskService } from '../../../../@core/services/task.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../@core/services/user.service';
import { DatePipe } from '@angular/common';
import { Task } from '../../../../@core/models/task';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { SiteService } from '../../../../@core/services/site.service';

@Component({
  selector: 'ngx-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {

  alive = true;
  submitted = false;

  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;

  searchTerm;

  contacts: any[];
  recent: any[];

  team;
  teamId;
  siteId;

  tasks: any = [];
  kpis = [];
  taskManager = [];
  safetyOfficials = [];
  taskDateStarted: any;

  toDo = [];
  inProgress: any = [];
  overdue = [];
  done = [];

  taskEditForm: FormGroup;
  selectedTask: any;
  userDetails;
  noImage = null;

  sites = [];

  teamMembers = [];

  public priorities = ['urgent', 'important', 'medium', 'low'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected location: Location,
    private userService: UserService,
    private dialogService: NbDialogService,
    private taskService: TaskService,
    private toastr: NbToastrService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private siteService: SiteService,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
  }


  ngOnInit() {
    this.siteId = +this.route.snapshot.paramMap.get('siteId');
    this.teamId = +this.route.snapshot.paramMap.get('teamId');
    this.taskService.refresh$.subscribe(
      () => {
        this.getTasks(this.siteId, this.teamId);
        this.getKPIs();
      },
    );
    this.transformDate();
    this.getTeamMembers();
    this.getTasks(this.siteId, this.teamId);
    this.getKPIs();

    this.getSites();

    this.taskEditForm = this.fb.group({
      name: ['', Validators.required],
      assign: ['', Validators.required],
      kpi: ['', Validators.required],
      priority: ['', Validators.required],
      safety_officer: ['', Validators.required],
      site: [''],
    });
  }

  getSites() {
    this.siteService.fetchSite()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.sites = data.results;
        },
      );
  }

  getTasks(site: number, team: number) {
    if (this.loggedInUser.role_name === 'TECHNICIAN') {
      this.taskService.fetchTechnicianTasks(this.loggedInUser.id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.tasks = data.results;
          this.classifyTasks();
        },
      );
      // this.taskService.fetchTeamTasks(this.loggedInUser.team_id)
      // .pipe(takeWhile(() => this.alive))
      // .subscribe(
      //   data => {
      //     this.tasks = data.results;
      //     this.classifyTasks();
      //   },
      // );
    } else {
      this.taskService.fetchSpecificTasks(site, team)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.tasks = data.results;
          this.classifyTasks();
        },
      );
    }
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

  getUserProfile(id) {
    this.userService.fetchOneProfile(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.userDetails = data;
        // console.log(data);
      });
  }

  getTeamMembers() {
    this.userService.fetchSpecificUsers(this.teamId)
      .subscribe(
        data => {
          this.teamMembers = data.results;
        },
      );
  }

  classifyTasks() {
    const todoTasks = [];
    const doneTasks = [];
    const overdueTasks = [];
    const inProgressTasks = [];

    this.tasks.forEach(item => {
      if (item.date_started === null || item.assign === null || item.assign === '') {
        // this.showToast('You have some tasks that have not been started or assigned yet', 'warning');
        todoTasks.push(item);
        const uniquetask = new Set(todoTasks);
        this.toDo = [...uniquetask];

      } else if (item.end_date !== null) {

        // this.getUserProfile(item.assign.id);
        doneTasks.push(item);
        const uniquetak = new Set(doneTasks);
        this.done = [...uniquetak];
        this.classifyDone();

      } else if (item.status === 'Overdue') {

        // this.getUserProfile(item.assign.id);
        overdueTasks.push(item);
        const uniquetas = new Set(overdueTasks);
        this.overdue = [...uniquetas];
        this.classifyOverdue();

      } else {

        // this.getUserProfile(item.assign.id);
        inProgressTasks.push(item);
        const uniquet = new Set(inProgressTasks);
        this.inProgress = [...uniquet];
        this.classifyInprogress();
      }


    });
  }

  classifyDone() {
    this.done.forEach(d => {
      d.days_taken = this.calcDaysTaken(d.date_started, d.end_date);
      d.statusColor = 'success';
      d.statusMessage = 'complete';
    });
    this.done.sort((a, b) => b.end_date - a.end_date);
  }

  classifyOverdue() {
    this.overdue.forEach(o => {
      o.due_date = new Date(this.calcEndDate(o.date_started, o.kpi.number_of_days));
      o.days_due = this.calcDaysDiff(o.due_date);
      o.statusColor = 'danger';
      o.statusMessage = 'High priority';
    });
    this.overdue.sort((a, b) => a.due_date - b.due_date);
  }

  classifyInprogress() {
    this.inProgress.forEach(i => {
      i.due_date = new Date(this.calcEndDate(i.date_started, i.kpi.number_of_days));
      i.days_running = this.calcDaysDiff(i.date_started);
      i.days_remaining = this.calcDaysDiff(this.calcEndDate(i.date_started, i.kpi.number_of_days));


      // if (i.days_remaining >= 20) {
      //   i.statusColor = 'info';
      //   i.statusMessage = 'Enough time';
      // } else if (i.days_remaining >= 10 && i.days_remaining < 20) {
      //   i.statusColor = 'warning';
      //   i.statusMessage = 'Top priority';
      // } else {
      //   i.statusColor = 'danger';
      //   i.statusMessage = 'Urgent';
      // }

      if (i.priority === 'urgent') {
        i.statusColor = 'danger';
        i.statusMessage = i.priority;
      } else if (i.priority === 'important') {
        i.statusColor = 'warning';
        i.statusMessage = i.priority;
      } else if (i.priority === 'medium') {
        i.statusColor = 'info';
        i.statusMessage = i.priority;
      } else if (i.priority === 'low') {
        i.statusColor = 'success';
        i.statusMessage = i.priority;
      }

    });
    this.inProgress.sort((a, b) => a.due_date - b.due_date);
  }

  transformDate() {
    this.taskDateStarted = this.datePipe.transform(new Date, 'yyyy-MM-dd');
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

  calcDaysTaken(dateStarted, dateEnded) {
    const date1: any = new Date(dateStarted);
    const date2: any = new Date(dateEnded);
    const diffInDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)); // milliseconds * seconds * minutes * hours
    return diffInDays;
  }

  saveTask(taskForm) {
    const modalCloseBtn = document.getElementById('close-task');
    this.submitted = true;
    let payload: any;

    if (this.siteId === 0) {
      payload = {
        'name': taskForm.name,
        'assign': taskForm.assign,
        'safety_officer': taskForm.safety_officer,
        'kpi': taskForm.kpi,
        'team': this.loggedInUser.team_id,
        'site': taskForm.site,
        'priority': taskForm.priority,
      };
    } else {
      payload = {
        'name': taskForm.name,
        'assign': taskForm.assign,
        'safety_officer': taskForm.safety_officer,
        'kpi': taskForm.kpi,
        'team': this.teamId,
        'site': this.siteId,
        'priority': taskForm.priority,
      };
    }

    let res: any;

    this.taskService.createTask(payload)
      .subscribe(
        (data) => {
          res = data;
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a Task', 'success');
          this.getTasks(res.site.id, res.team.id);
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to save task', 'danger');
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

  startTask(task) {
    if (task.assign === null || task.assign === '') {
      this.showToast('Unable to start task because it is not assigned to anyone', 'danger');
    } else {
      const payload = {
        'date_started': this.taskDateStarted,
      };
      this.taskService.editTask(task.id, payload)
        .subscribe(
          () => {
            this.router.navigate([`/operations/task-detail/${task.id}`]);
          },
          (error: HttpErrorResponse) => {
            this.showToast('Unable to start task', 'danger');
          },
        );
    }

  }

  confirmDelete(task) {
    const x = confirm('Are you sure you want to remove this task?');
    if (x) {
      this.removeTask(task);
    } else {
      return false;
    }
  }

  removeTask(task) {
    this.taskService.deleteTask(task.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Removed the Task`, 'success');
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Operation unsuccessful', 'danger');
        },
      );
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

    this.taskService.editTask(this.selectedTask.id, payload)
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



  saveSubTask(taskForm) {
    const modalCloseBtn = document.getElementById('close-task');
    this.submitted = true;

    const payload = {
      'name': taskForm.name,
      'assign': taskForm.assign,
      'kpi': taskForm.kpi,
      'task': this.selectedTask.id,
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

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  viewDetails(task) {
    this.router.navigate([`/operations/task-detail/${task.id}`]);
  }

  open(dialog: TemplateRef<any>) {
    this.getUsers();
    setTimeout(() => {
      this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    }, 2000);
  }

  editTaskForm(task, dialog1: TemplateRef<any>) {
    this.getUsers();
    this.selectedTask = task;
    this.changeTask(task);
    setTimeout(() => {
      this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    }, 2000);
  }


  addSubtaskForm(task, dialog2: TemplateRef<any>) {
    this.getUsers();
    this.selectedTask = task;

    setTimeout(() => {
      this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
    }, 2000);
  }

  viewChats(user) {
    this.router.navigateByUrl(`chat/messages`);
    // this.router.navigateByUrl(`pages/extra-components/chat/${user.id}/${this.loggedInUser.id}`);
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
