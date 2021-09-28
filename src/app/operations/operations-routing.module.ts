import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OperationsComponent } from './operations.component';
import { ProjectDetailComponent } from './project/project.component';
import { SiteComponent } from './project/sites/site.component';
import { TeamComponent } from './project/sites/teams/team.component';
import { TaskComponent } from './project/sites/tasks/task.component';
import { TaskDetailComponent } from './project/sites/tasks/task-details/task-detail.component';
import { SubTaskComponent } from './project/sites/tasks/task-details/sub-task/sub-task.component';
import { ClientComponent } from './client/client-service.component';


const routes: Routes = [{

  path: '',
  component: OperationsComponent,
  children: [
    {
      path: 'projects/:id',
      component: ProjectDetailComponent,
    },
    {
      path: 'sites/:id',
      component: SiteComponent,
    },
    {
      path: 'teams/:id',
      component: TeamComponent,
    },
    {
      path: 'tasks/:siteId/:teamId',
      component: TaskComponent,
    },
    {
      path: 'tasks',
      component: TaskComponent,
    },
    {
      path: 'task-detail/:id',
      component: TaskDetailComponent,
    },
    {
      path: 'subtasks/:id',
      component: SubTaskComponent,
    },
    {
      path: 'setup',
      component: ClientComponent,
    },
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsRoutingModule { }
