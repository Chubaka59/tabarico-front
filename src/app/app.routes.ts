import { Routes } from '@angular/router';
import {
  PersonalDashboardComponent
} from './accounting/components/personal-dashboard-component/personal-dashboard.component';
import {AuthGuard} from './core/guards/auth.guard';
import {LoginComponent} from './core/components/login-component/login-component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'personalDashboard', component: PersonalDashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'logout',
    resolve: { logout: () => { localStorage.removeItem('token'); return true; } },
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', redirectTo: '/login' }
];
