import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NbLayoutModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbAlertModule,
    NbActionsModule,
    NbProgressBarModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbUserModule,
    NbListModule,
    NbRadioModule,
    NbPopoverModule,
    NbSearchModule,
    NbCheckboxModule,
    NbInputModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbAccordionModule,
    NbMenuModule,
    NbChatModule,
    NbDatepickerModule,
    NbSidebarModule,
    NbDialogModule,
    NbWindowModule,
    NbToastrModule,
    NbTooltipModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';

@NgModule({
    imports: [],
    declarations: [],
    exports: [
        CommonModule,
        NbLayoutModule,
        NbCardModule,
        FormsModule,
        ReactiveFormsModule,
        NbIconModule,
        ThemeModule,
        NbMenuModule,
        NbButtonModule,
        NbAlertModule,
        NbActionsModule,
        NbChatModule,
        NbProgressBarModule,
        NbSelectModule,
        NbSpinnerModule,
        NbTabsetModule,
        NbUserModule,
        NbListModule,
        NbRadioModule,
        NbPopoverModule,
        NbSearchModule,
        NbCheckboxModule,
        NbDatepickerModule,
        NbInputModule,
        NbSidebarModule,
        NbDialogModule,
        NbRouteTabsetModule,
        NbStepperModule,
        NbAccordionModule,
        NbWindowModule,
        NbToastrModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        NbEvaIconsModule,
        NbCardModule,
        NbTooltipModule,
        NgxEchartsModule,
        NgxChartsModule,
        ChartModule,
    ],
})
export class SharedModule { }
