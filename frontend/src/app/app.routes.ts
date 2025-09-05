import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import {anonymousGuardGuard} from './guard/anonymous-guard-guard';
import {HomeComponent} from './home/home-component/home-component';
import {loggedGuardGuard} from './guard/logged-guard-guard';
import {MainLayoutComponent} from './layout/main-layout-component/main-layout-component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account/login' },
  { path: 'test', component: MainLayoutComponent },
  {
    path: 'account', canActivate: [anonymousGuardGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  { path: 'home', component: HomeComponent, canActivate: [loggedGuardGuard] },
  { path: '**', redirectTo: 'account/login' },
];
