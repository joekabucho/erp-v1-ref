import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OhsRoutingModule } from './ohs-routing.module';
import { SharedModule } from '../@core/modules/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapsModule } from '../operations/maps/maps.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { DataTablesModule } from 'angular-datatables';
import { OhsComponent } from './ohs.component';
import { JobComponent } from './job/job.component';
import { DocumentComponent } from './documents/document.component';
import { JobDetailComponent } from './job/job-details/job-detail.component';
import { JobIncidentComponent } from './job/job-incidents/job-incident.component';
import { HazardAnalysisComponent } from './hazard/hazard.component';
import { WorkpermitsComponent } from './workpermits/workpermits.component';
import { ToolboxtalksComponent } from './toolboxtalks/toolboxtalks.component';
import { SafetyinductionsComponent } from './safetyinductions/safetyinductions.component';
import { SiteinspectionsComponent } from './siteinspections/siteinspections.component';
import { SafetycommunicationsplansComponent } from './safetycommunicationsplans/safetycommunicationsplans.component';
import { D3Component } from './d3/d3.component';
import { D3BarJobsComponent } from './d3/d3-bar-jobs.component';
import { D3LineComponent } from './d3/d3-line.component';
import { D3PiePtwComponent } from './d3/d3-pie-ptw.component';
import { D3AreaStackComponent } from './d3/d3-area-stack.component';
import { D3PolarComponent } from './d3/d3-polar.component';
import { D3AdvancedPieComponent } from './d3/d3-advanced-pie.component';
import { AgmCoreModule } from '@agm/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SetupComponent } from './setup/setup.component';
import { NgxAutocomPlaceModule } from 'ngx-autocom-place';
import { PhotosComponent } from './pages/photos/photos.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { InductionComponent } from './pages/induction/induction.component';
import { PermitsComponent } from './pages/permits/permits.component';
import { JhaComponent } from './pages/jha/jha.component';
import { TbtComponent } from './pages/tbt/tbt.component';
import { TbtCreateModalComponent } from './pages/tbt-create-modal/tbt-create-modal.component';
import { IonicModule } from '@ionic/angular';
import { IncidentCreateModalComponent } from './pages/incident-create-modal/incident-create-modal.component';
import { InductionCreateModalComponent } from './pages/induction-create-modal/induction-create-modal.component';
import { JhaCreateModalComponent } from './pages/jha-create-modal/jha-create-modal.component';
import { PermitCreateModalComponent } from './pages/permit-create-modal/permit-create-modal.component';
import { TicketApprovalComponent } from './pages/ticket-approval/ticket-approval.component';
import { PermitApprovalComponent } from './pages/permit-approval/permit-approval.component';
import { JhaEditComponent } from './pages/jha-edit/jha-edit.component';
import { TbtEditComponent } from './pages/tbt-edit/tbt-edit.component';
import { InductionEditComponent } from './pages/induction-edit/induction-edit.component';
import { IncidentEditComponent } from './pages/incident-edit/incident-edit.component';
import { PpeCreateComponent } from './pages/ppe-create/ppe-create.component';
import { PpeEditComponent } from './pages/ppe-edit/ppe-edit.component';
import { SseCreateComponent } from './pages/sse-create/sse-create.component';
import { SseEditComponent } from './pages/sse-edit/sse-edit.component';
import { AttendantsComponent } from './pages/attendants/attendants.component';
import { CommunicationplanComponent } from './pages/communicationplan/communicationplan.component';
import { CommunicationplanCreateComponent } from './pages/communicationplan-create/communicationplan-create.component';
import { CommunicationplanEditComponent } from './pages/communicationplan-edit/communicationplan-edit.component';
import { JhaPageEditComponent } from './report-pages/jha-edit/jha-edit.component';
import { InductionPageEditComponent } from './report-pages/induction-edit/induction-edit.component';
import { TbtPageEditComponent } from './report-pages/tbt-edit/tbt-edit.component';
import { CommEditComponent } from './report-pages/comm-edit/comm-edit.component';
import { IncidentPageEditComponent } from './report-pages/incident-edit/incident-edit.component';
import { D3BarPtwPerComponent } from './d3/d3-bar-ptw-per.component';
import { D3BarJobsPerComponent } from './d3/d3-bar-jobs-per.component';
import { D3LinePtwComponent } from './d3/d3-line-ptw.component';
import { SiteInspaectionEditComponent } from './report-pages/site-inspaection-edit/site-inspaection-edit.component';
import { SiteInspectionAddComponent } from './report-pages/site-inspection-add/site-inspection-add.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {PositiveSafetyObservationComponent} from './positive-safety-observation/positive-safety-observation.component';





@NgModule({
  imports: [
    OhsRoutingModule,
    NgbModule,
    MapsModule,
    DataTablesModule,
    SharedModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    AgmCoreModule,
    FontAwesomeModule,
    PdfViewerModule,
    NgxAutocomPlaceModule,
    IonicModule,
    AutocompleteLibModule,
  ],
  declarations: [
    OhsComponent,
    JobComponent,
    DocumentComponent,
    JobDetailComponent,
    JobIncidentComponent,
    HazardAnalysisComponent,
    WorkpermitsComponent,
    ToolboxtalksComponent,
    SafetyinductionsComponent,
    SiteinspectionsComponent,
    SafetycommunicationsplansComponent,
    D3Component,
    D3BarJobsComponent,
    D3LineComponent,
    D3PiePtwComponent,
    D3AreaStackComponent,
    D3PolarComponent,
    D3AdvancedPieComponent,
    SetupComponent,
    PhotosComponent,
    IncidentsComponent,
    InductionComponent,
    PermitsComponent,
    JhaComponent,
    TbtComponent,
    TbtCreateModalComponent,
    IncidentCreateModalComponent,
    InductionCreateModalComponent,
    JhaCreateModalComponent,
    PermitCreateModalComponent,
    TicketApprovalComponent,
    PermitApprovalComponent,
    JhaEditComponent,
    TbtEditComponent,
    InductionEditComponent,
    IncidentEditComponent,
    PpeCreateComponent,
    PpeEditComponent,
    SseCreateComponent,
    SseEditComponent,
    AttendantsComponent,
    CommunicationplanComponent,
    CommunicationplanCreateComponent,
    CommunicationplanEditComponent,
    CommEditComponent,
    JhaPageEditComponent,
    InductionPageEditComponent,
    IncidentPageEditComponent,
    TbtPageEditComponent,
    D3BarPtwPerComponent,
    D3BarJobsPerComponent,
    D3LinePtwComponent,

    SiteInspaectionEditComponent,
    SiteInspectionAddComponent,
    PositiveSafetyObservationComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class OhsModule { }
