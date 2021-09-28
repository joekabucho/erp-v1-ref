import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CasualComponent } from './casual.component';

import { CasualListComponent, CasualReportComponent, CasualDetailComponent } from './casual-detail/casuals.component';



const routes: Routes = [{
  path: '',
  component: CasualComponent,
  children: [
    {
      path: 'report',
      component: CasualReportComponent,
    },
    {
      path: 'list',
      component: CasualListComponent,
    },
    {
      path: 'weekly-details/:week',
      component: CasualDetailComponent,
    },
    {
      path: 'technician-details/:week/:id',
      component: CasualDetailComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CasualRoutingModule { }
