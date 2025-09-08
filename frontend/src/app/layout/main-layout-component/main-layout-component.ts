import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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
  ],
  templateUrl: './main-layout-component.html',
  styleUrls: ['./main-layout-component.css'],
})
export class MainLayoutComponent implements OnInit {
  opened: boolean = true;
  isDark: boolean = false;
  protected activatedRoute = inject(ActivatedRoute);
  private cookieService = inject(CookieService);
  private router = inject(Router);

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
