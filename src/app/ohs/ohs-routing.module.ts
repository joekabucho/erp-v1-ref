import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OhsComponent } from './ohs.component';
import { JobComponent } from './job/job.component';
import { DocumentComponent } from './documents/document.component';
import { JobDetailComponent } from './job/job-details/job-detail.component';
import {PositiveSafetyObservationComponent} from './positive-safety-observation/positive-safety-observation.component';
import { JobIncidentComponent } from './job/job-incidents/job-incident.component';
import {  HazardAnalysisComponent } from './hazard/hazard.component';
import { SafetyinductionsComponent } from './safetyinductions/safetyinductions.component';
import { SiteinspectionsComponent } from './siteinspections/siteinspections.component';
import { ToolboxtalksComponent } from './toolboxtalks/toolboxtalks.component';
import { WorkpermitsComponent } from './workpermits/workpermits.component';
import { SafetycommunicationsplansComponent } from './safetycommunicationsplans/safetycommunicationsplans.component';
import { D3Component } from './d3/d3.component';
import { SetupComponent } from './setup/setup.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { InductionComponent } from './pages/induction/induction.component';
import { JhaComponent } from './pages/jha/jha.component';
import { PermitsComponent } from './pages/permits/permits.component';
import { PhotosComponent } from './pages/photos/photos.component';
import { TbtComponent } from './pages/tbt/tbt.component';
import { TbtCreateModalComponent } from './pages/tbt-create-modal/tbt-create-modal.component';
import { IncidentCreateModalComponent } from './pages/incident-create-modal/incident-create-modal.component';
import { InductionCreateModalComponent } from './pages/induction-create-modal/induction-create-modal.component';
import { PermitCreateModalComponent } from './pages/permit-create-modal/permit-create-modal.component';
import { JhaCreateModalComponent } from './pages/jha-create-modal/jha-create-modal.component';
import { PermitApprovalComponent } from './pages/permit-approval/permit-approval.component';
import { TicketApprovalComponent } from './pages/ticket-approval/ticket-approval.component';
import { InductionEditComponent } from './pages/induction-edit/induction-edit.component';
import { JhaEditComponent } from './pages/jha-edit/jha-edit.component';
import { TbtEditComponent } from './pages/tbt-edit/tbt-edit.component';
import { PpeCreateComponent } from './pages/ppe-create/ppe-create.component';
import { PpeEditComponent } from './pages/ppe-edit/ppe-edit.component';
import { SseEditComponent } from './pages/sse-edit/sse-edit.component';
import { SseCreateComponent } from './pages/sse-create/sse-create.component';
import { AttendantsComponent } from './pages/attendants/attendants.component';
import { CommunicationplanComponent } from './pages/communicationplan/communicationplan.component';
import { CommunicationplanCreateComponent } from './pages/communicationplan-create/communicationplan-create.component';
import { CommunicationplanEditComponent } from './pages/communicationplan-edit/communicationplan-edit.component';
import { IncidentPageEditComponent } from './report-pages/incident-edit/incident-edit.component';
import { JhaPageEditComponent } from './report-pages/jha-edit/jha-edit.component';
import { InductionPageEditComponent } from './report-pages/induction-edit/induction-edit.component';
import { TbtPageEditComponent } from './report-pages/tbt-edit/tbt-edit.component';
import {CommEditComponent  } from './report-pages/comm-edit/comm-edit.component';
import {SiteInspaectionEditComponent  } from './report-pages/site-inspaection-edit/site-inspaection-edit.component';
import {SiteInspectionAddComponent  } from './report-pages/site-inspection-add/site-inspection-add.component';


const routes: Routes = [{
  path: '',
  component: OhsComponent,
  children: [
    {
      path: 'hazard-analysis',
      component: HazardAnalysisComponent,
    },
    {
      path: 'job',
      component: JobComponent,
    },
    {
      path: 'document',
      component: DocumentComponent,
    },
    {
      path: 'positive-safety-observation',
      component: PositiveSafetyObservationComponent,
    },
    {
      path: 'job-detail/:id',
      component: JobDetailComponent,
    },
    {
      path: 'job-incident',
      component: JobIncidentComponent,
    },
    {
      path: 'safety-inductions',
      component: SafetyinductionsComponent,
    },
    {
      path: 'safety-communication-plans',
      component: SafetycommunicationsplansComponent,
    },
    {
      path: 'site-inspection',
      component: SiteinspectionsComponent,
    },
    {
      path: 'toolbox-talks',
      component: ToolboxtalksComponent,
    },
    {
      path: 'workpermits',
      component: WorkpermitsComponent,
    },
    {
      path: 'd3',
      component: D3Component,
    },
    {
      path: 'setup',
      component: SetupComponent,
    },
    {
      path: '',
      redirectTo: 'd3',
      pathMatch: 'full',
    },
    {
      path: 'pages-incidents',
      component: IncidentsComponent,
    },
    {
      path: 'pages-induction',
      component: InductionComponent,
    },
    {
      path: 'pages-jha',
      component: JhaComponent,
    },
    {
      path: 'pages-permits',
      component: PermitsComponent,
    },
    {
      path: 'pages-photos',
      component: PhotosComponent,
    },
    {
      path: 'pages-tbt',
      component: TbtComponent,
    },
    {
      path: 'tbt-create-modal',
      component: TbtCreateModalComponent,
    },
    {
      path: 'incident-create-modal',
      component: IncidentCreateModalComponent,
    },
    {
      path: 'induction-create-modal',
      component: InductionCreateModalComponent,
    },
    {
      path: 'permit-create-modal',
      component: PermitCreateModalComponent,
    },
    {
      path: 'jha-create-modal',
      component: JhaCreateModalComponent,
    },
    {
      path: 'ticket-approval',
      component: TicketApprovalComponent,
    },
    {
      path: 'permit-approval',
      component: PermitApprovalComponent,
    },
    {
      path: 'tbt-edit',
      component: TbtEditComponent,
    },
    {
      path: 'jha-edit',
      component: JhaEditComponent,
    },
    {
      path: 'induction-edit',
      component: InductionEditComponent,
    },
    {
      path: 'ppe-create',
      component: PpeCreateComponent,
    },
    {
      path: 'ppe-edit',
      component: PpeEditComponent,
    },
    {
      path: 'sse-create',
      component: SseCreateComponent,
    },
    {
      path: 'sse-edit',
      component: SseEditComponent,
    },
    {
      path: 'attendants',
      component: AttendantsComponent,
    },
    {
      path: 'commplan',
      component: CommunicationplanComponent,
    },
    {
      path: 'commplan-edit',
      component: CommunicationplanEditComponent,
    },
    {
      path: 'comm-edit',
      component: CommEditComponent,
    },
    {
      path: 'jha-page-edit',
      component: JhaPageEditComponent,
    },
    {
      path: 'induction-page-edit',
      component: InductionPageEditComponent,
    },
    {
      path: 'incident-page-edit',
      component: IncidentPageEditComponent,
    },
    {
      path: 'tbt-page-edit',
      component: TbtPageEditComponent,
    },
    {
      path: 'commplan-create',
      component: CommunicationplanCreateComponent,
    },
    {
      path: 'site-inspection-edit',
      component: SiteInspaectionEditComponent,
    },
    {
      path: 'site-inspection-add',
      component: SiteInspectionAddComponent,
    },
    // {
    //   path: '**',
    //   component: NotFoundComponent,
    // },
  ],

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OhsRoutingModule { }
