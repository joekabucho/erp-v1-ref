import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { UserFormComponent } from './user-form/user-form.component';
import { PermissionComponent } from './permission-form/permission.component';
import { DivisionComponent, DepartmentComponent } from './organization/organization.component';
import { AuditTrailComponent, LoginTrailComponent } from './user-trail/user-trail.component';
import { SubconComponent } from './subcon/subcon.component';
import {SlaComponent} from './sla/sla.component';
import {CreateSLAComponent} from './sla/create-sla/create-sla.component';


const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: 'smart-table',
      component: SmartTableComponent,
    },
    {
      path: 'user/:id',
      component: UserFormComponent,
    },
    {
      path: 'permission',
      component: PermissionComponent,
    },
    {
      path: 'division',
      component: DivisionComponent,
    },
    {
      path: 'department',
      component: DepartmentComponent,
    },
    {
      path: 'audit-trail',
      component: AuditTrailComponent,
    },
    {
      path: 'login-trail',
      component: LoginTrailComponent,
    },
    {
      path: 'subcontructor',
      component: SubconComponent,
    },
    {
      path: 'sla',
      component: SlaComponent,
    },
    {
      path: 'sla/new',
      component: CreateSLAComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
