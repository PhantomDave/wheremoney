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

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account/login' },
  {
    path: 'account',
    canActivate: [anonymousGuardGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: 'table', canActivate: [loggedGuardGuard], component: TablesListComponent },
  { path: 'table/create', canActivate: [loggedGuardGuard], component: CreateTableComponent },
  {
    path: 'table/:id',
    canActivate: [loggedGuardGuard],
    component: TableDetailComponent,
    resolve: { table: tableResolverResolver },
  },
  { path: 'home', component: HomeComponent, canActivate: [loggedGuardGuard] },
  { path: '**', redirectTo: '404' },
  { path: '404', component: NotFoundComponent },
];
