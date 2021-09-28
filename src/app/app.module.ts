import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './@core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';



import {
  NbSidebarModule,
  NbMenuModule,
  NbToastrModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbChatModule,
  NbInputModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { WelcomeComponent } from './welcome-page/welcome.component';
import { HttpConfigInterceptor } from './@core/interceptors/httpconfig.interceptor';
import { SharedModule } from './@core/modules/shared.module';
import { env } from '../../secret_env';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const createStorageHost = require('cross-domain-storage/host');
createStorageHost([
  {
    origin: env.env.WAREHOUSE_URL,
    allowedMethods: ['get', 'set', 'remove'],
  },
]);
@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    ChartsModule,
    FormsModule,
    FontAwesomeModule,
    DataTablesModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC5kI2ISbLRzIFcSl5aiNHIlOLGpdVHucs',
      libraries: ['places'],
    }),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyB0zyIM1LF2odkw7inxq7IX_mW7koywFBU',
    }),
    NbInputModule,
    NbSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
