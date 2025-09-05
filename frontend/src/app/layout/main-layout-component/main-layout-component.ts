import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import {AccountService} from '../../services/profile/account-service';

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
    RouterOutlet
  ],
  templateUrl: './main-layout-component.html',
  styleUrls: ['./main-layout-component.css']
})
export class MainLayoutComponent implements OnInit {
  opened: boolean = true;
  isDark: boolean = false;

  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    // Initialize theme from localStorage, otherwise use prefers-color-scheme
    const stored = localStorage.getItem('wheremoney-theme');
    if (stored) {
      this.isDark = stored === 'dark';
    } else {
      this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('wheremoney-theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  isLoggedIn(): boolean {
    console.log('isLoggedIn', this.accountService.selectedAccount());
    return this.accountService.selectedAccount() !== null;
  }
}
