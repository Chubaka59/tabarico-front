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
import {
  StockManagementComponent
} from './administration/component/stock-management.component/stock-management.component';
import {UserListComponent} from './administration/component/user-list-component/user-list-component';
import {ChangePasswordComponent} from './administration/component/change-password.component/change-password.component';
import {ConfigurationComponent} from './administration/component/configuration.component/configuration.component';
import {ResponsableGuard} from './core/guards/responsable.guard';
import {CdiGuard} from './core/guards/cdi.guard';
import {ForbiddenComponent} from './core/components/forbidden.component/forbidden.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'personalDashboard', component: PersonalDashboardComponent, canActivate: [AuthGuard] },
  { path: 'addExporterSale', component: ExporterSaleFormComponent, canActivate: [AuthGuard] },
  { path: 'addCustomerSale', component: CustomerSaleFormComponent, canActivate: [AuthGuard, CdiGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, ResponsableGuard] },
  { path: 'modifyStock', component: StockManagementComponent, canActivate: [AuthGuard, CdiGuard] },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard, ResponsableGuard]},
  { path: 'resetPassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthGuard, ResponsableGuard] },
  {
    path: 'logout',
    resolve: { logout: () => { localStorage.removeItem('token');localStorage.removeItem('role'); return true;
      }
    },
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', redirectTo: '/login' }
];
