import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../../models/profile/account';
import { AccountService } from '../../services/profile/account-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    RouterModule,
    MatProgressSpinner,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  showPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get loading() {
    return this.accountService.loading;
  }

  get error() {
    return this.accountService.error;
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const account: Account = new Account(
      this.registerForm.value.username,
      this.registerForm.value.email,
      this.registerForm.value.password,
    );

    if (this.error() !== null) {
      setTimeout(() => {
        this.accountService.clearError();
      }, 3000);
      const message = this.error()!;
      this.snackBar.open(message, 'Close', { duration: 3000 });
      return;
    }

    await this.accountService.createAccount(account);
    if (this.accountService.account !== undefined) {
      this.registerForm.reset();
      this.submitted = false;
      await this.router.navigate(['/account/login']);
    }
  }
}
