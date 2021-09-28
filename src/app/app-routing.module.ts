import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './@core/guards/auth.guard';
import { WelcomeComponent } from './welcome-page/welcome.component';
import { CustomPreloadingService } from './@core/services/custom-preloading.service';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pages',
    data: { preload: true },
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'operations',
    data: { preload: true },
    loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'ohs',
    loadChildren: () => import('./ohs/ohs.module').then(m => m.OhsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'casual',
    loadChildren: () => import('./casuals/casual.module').then(m => m.CasualModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', redirectTo: 'welcome' },
];

const config: ExtraOptions = {
  preloadingStrategy: CustomPreloadingService,
  // useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
