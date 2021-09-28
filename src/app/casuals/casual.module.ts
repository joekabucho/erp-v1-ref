import { NgModule } from '@angular/core';
import { SharedModule } from '../@core/modules/shared.module';
import { CasualRoutingModule } from './casual-routing.module';


// components
import { CasualComponent } from './casual.component';
import { CasualReportComponent, CasualDetailComponent, CasualListComponent } from './casual-detail/casuals.component';
import {DataTablesModule} from 'angular-datatables';



const COMPONENTS = [
  CasualComponent,
  CasualListComponent,
  CasualReportComponent,
  CasualDetailComponent,
];

const MODULES = [
  SharedModule,
  CasualRoutingModule,
];

@NgModule({
    imports: [
        ...MODULES,
        DataTablesModule,
    ],
  declarations: [
    ...COMPONENTS,
  ],
})
export class CasualModule { }
