import { NgModule } from '@angular/core';
import { OperationsRoutingModule } from './operations-routing.module';
import { SharedModule } from '../@core/modules/shared.module';
import { MapsModule } from './maps/maps.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxEchartsModule } from 'ngx-echarts';

// components
import { OperationsComponent } from './operations.component';
import { ProjectDetailComponent } from './project/project.component';
import { SiteComponent } from './project/sites/site.component';
import { TeamComponent } from './project/sites/teams/team.component';
import { TaskComponent } from './project/sites/tasks/task.component';
import { SubTaskComponent } from './project/sites/tasks/task-details/sub-task/sub-task.component';
import { TaskDetailComponent } from './project/sites/tasks/task-details/task-detail.component';
import { ClientComponent } from './client/client-service.component';
import { AgmCoreModule } from '@agm/core';
import { NgxAutocomPlaceModule } from 'ngx-autocom-place';



@NgModule({
  imports: [
    OperationsRoutingModule,
    SharedModule,
    MapsModule,
    LeafletModule,
    NgxEchartsModule,
    AgmCoreModule,
    NgxAutocomPlaceModule,

  ],
  declarations: [
    OperationsComponent,
    ProjectDetailComponent,
    SiteComponent,
    TeamComponent,
    TaskComponent,
    SubTaskComponent,
    TaskDetailComponent,
    ClientComponent,

  ],
  providers: [],

})
export class OperationsModule { }
