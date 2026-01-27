import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { HomeComponent } from './home-component/home-component';
import { AuthGuard } from './guards/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden' ;


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN' , 'WAREHOUSE_MANAGER'] }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CLIENT'] }
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  }
];
