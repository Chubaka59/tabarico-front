import { Routes } from '@angular/router';
import {
  PersonalDashboardComponent
} from './accounting/components/personal-dashboard-component/personal-dashboard.component';
import {AuthGuard} from './core/guards/auth.guard';
import {LoginComponent} from './core/components/login-component/login-component';
import {
  ExporterSaleFormComponent
} from './accounting/components/exporter-sale-form-component/exporter-sale-form-component';
import { CustomerSaleFormComponent } from './accounting/components/customer-sale-form-component/customer-sale-form-component'
import {DashboardComponent} from './accounting/components/dashboard-component/dashboard-component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'personalDashboard', component: PersonalDashboardComponent, canActivate: [AuthGuard] },
  { path: 'addExporterSale', component: ExporterSaleFormComponent, canActivate: [AuthGuard] },
  { path: 'addCustomerSale', component: CustomerSaleFormComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'logout',
    resolve: { logout: () => { localStorage.removeItem('token'); return true; } },
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', redirectTo: '/login' }
];
