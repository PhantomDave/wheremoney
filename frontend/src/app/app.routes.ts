import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { anonymousGuardGuard } from './guard/anonymous-guard-guard';
import { loggedGuardGuard } from './guard/logged-guard-guard';
import { HomeComponent } from './home/home-component/home-component';
import { CreateTableComponent } from './table/create-table-component/create-table-component';
import { TableDetailComponent } from './table/table-detail-component/table-detail-component';
import { NotFoundComponent } from './utils/not-found-component/not-found-component';
import { TablesListComponent } from './table/tables-list-component/tables-list-component';
import { tableResolverResolver } from './resolvers/table-resolver-resolver';
import { ImportComponent } from './import/import-component/import-component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account/login' },
  {
    path: 'account',
    canActivate: [anonymousGuardGuard],
    data: { breadcrumb: 'Account' },
    children: [
      { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },
      { path: 'register', component: RegisterComponent, data: { breadcrumb: 'Registration' } },
    ],
  },
  {
    path: 'table',
    canActivate: [loggedGuardGuard],
    component: TablesListComponent,
    data: { breadcrumb: 'Tables' },
  },
  {
    path: 'table/create',
    canActivate: [loggedGuardGuard],
    component: CreateTableComponent,
    data: { breadcrumb: 'Create Table' },
  },
  {
    path: 'table/:id',
    canActivate: [loggedGuardGuard],
    component: TableDetailComponent,
    resolve: { table: tableResolverResolver },
    data: { breadcrumb: 'Table Detail' },
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [loggedGuardGuard],
    data: { breadcrumb: 'Home' },
  },
  {
    path: 'import',
    component: ImportComponent,
    canActivate: [loggedGuardGuard],
    data: { breadcrumb: 'Import Data' },
  },
  { path: '404', component: NotFoundComponent, data: { breadcrumb: '404' } },
  { path: '**', redirectTo: '404' },
];
