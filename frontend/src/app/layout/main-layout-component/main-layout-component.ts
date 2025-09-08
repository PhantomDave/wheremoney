import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AccountService } from '../../services/profile/account-service';
import { CookieService } from 'ngx-cookie-service';
import { Breadcrumb } from '../breadcrumb/breadcrumb';

@Component({
  selector: 'app-main-layout-component',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    Breadcrumb,
  ],
  templateUrl: './main-layout-component.html',
  styleUrls: ['./main-layout-component.css'],
})
export class MainLayoutComponent implements OnInit {
  opened: boolean = true;
  isDark: boolean = false;

  constructor(
    private readonly cookieService: CookieService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('wheremoney-theme');
    if (stored) {
      this.isDark = stored === 'dark';
    } else {
      this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    document.body.style.setProperty('color-scheme', this.isDark ? 'dark' : 'light');
  }

  isLoggedIn(): boolean {
    return (
      this.cookieService.get('jwt_session') !== null && this.cookieService.get('jwt_session') !== ''
    );
  }

  logout() {
    this.cookieService.delete('jwt_session');
    this.router.navigate(['/account/login']);
  }
}
