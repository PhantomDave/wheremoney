import { Component } from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import {AccountService} from '../../services/profile/account-service';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatIconModule,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  showPassword = false;

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get loading() {
    return this.accountService.loading;
  }

  get error() {
    return this.accountService.error;
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const loginResponse = await this.accountService.loginAccount(this.loginForm.value.email, this.loginForm.value.password);

    if (this.accountService.selectedAccount !== null) {
      this.accountService.setLoggedIn(loginResponse.token);
      await this.router.navigate(['/']);
      return;
    }
  }

}
