import { Routes } from '@angular/router';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { anonymousGuardGuard } from './guard/anonymous-guard-guard';
import { loggedGuardGuard } from './guard/logged-guard-guard';
import { HomeComponent } from './components/home/home-component/home-component';
import { CreateTableComponent } from './components/table/create-table-component/create-table-component';
import { TableDetailComponent } from './components/table/table-detail-component/table-detail-component';
import { NotFoundComponent } from './components/utils/not-found-component/not-found-component';
import { TablesListComponent } from './components/table/tables-list-component/tables-list-component';
import { tableResolverResolver } from './resolvers/table-resolver-resolver';
import { ImportComponent } from './components/import/import-component/import-component';
import { DataDetailsComponent } from './components/data/data-details-component/data-details-component';
import { DataSelectionComponent } from './components/data/data-selection-component/data-selection-component';
import { ListWidgetComponent } from './components/widgets/list-widget-component/list-widget-component';
import { WidgetDetailsComponent } from './components/widgets/widget-details-component/widget-details-component';
import { CreateWidgetComponent } from './components/widgets/create-widget-component/create-widget-component';
import { DashboardComponent } from './components/dashboard/dashboard-component/dashboard-component';

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
  {
    path: 'data',
    component: DataSelectionComponent,
    canActivate: [loggedGuardGuard],
    data: { breadcrumb: 'Data List' },
    children: [
      {
        path: ':id',
        component: DataDetailsComponent,
        canActivate: [loggedGuardGuard],
        data: { breadcrumb: 'Data Details' },
      },
    ],
  },
  {
    path: 'widget',
    component: ListWidgetComponent,
    canActivate: [loggedGuardGuard],
    data: { breadcrumb: 'Widgets' },
  },
  {
    path: 'widget/create',
    component: CreateWidgetComponent,
    canActivate: [loggedGuardGuard],
    data: { breadcrumb: 'Create Widget' },
  },
  {
    path: 'widget/:id',
    component: WidgetDetailsComponent,
    canActivate: [loggedGuardGuard],
    data: { breadcrumb: 'Widget Details' },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [loggedGuardGuard],
    data: { breadcrumb: 'Dashboard' },
  },
  { path: '404', component: NotFoundComponent, data: { breadcrumb: '404' } },
  { path: '**', redirectTo: '404' },
];
