import { NgModule } from '@angular/core';
import { SharedModule } from '../@core/modules/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

// components
import { AdminComponent } from './admin.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { UserFormComponent } from './user-form/user-form.component';
import { PermissionComponent } from './permission-form/permission.component';
import { DivisionComponent, DepartmentComponent } from './organization/organization.component';
import { AuditTrailComponent, LoginTrailComponent } from './user-trail/user-trail.component';
import { NgxAutocomPlaceModule } from 'ngx-autocom-place';
import { SubconComponent } from './subcon/subcon.component';
import { OrderByPipe } from './order-by.pipe';
import { ReversePipe } from './reverse.pipe';
import { SlaComponent } from './sla/sla.component';
import { NbInputModule, NbToggleModule, NbTreeGridModule } from '@nebular/theme';
import { CreateSLAComponent } from './sla/create-sla/create-sla.component';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';


@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    NgxAutocomPlaceModule,
    NbInputModule,
    NbTreeGridModule,
    NbToggleModule,
    AutocompleteLibModule,
  ],
  declarations: [
    AdminComponent,
    SmartTableComponent,
    UserFormComponent,
    PermissionComponent,
    DivisionComponent,
    DepartmentComponent,
    AuditTrailComponent,
    LoginTrailComponent,
    SubconComponent,
    OrderByPipe,
    ReversePipe,
    SlaComponent,
    CreateSLAComponent,
  ],

})
export class AdminModule { }
