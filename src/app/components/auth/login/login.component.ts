import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, clearErrors } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthErrors } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-icon">⚡</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your StackUp account</p>
        </div>

        <div class="error-list" *ngIf="errors$ | async as errors">
          <div class="error-item" *ngFor="let key of objectKeys(errors)">{{ errors[key] }}</div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" type="email" formControlName="email" placeholder="john@example.com" autocomplete="email"/>
            <span class="field-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              Valid email is required
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" placeholder="Your password" autocomplete="current-password"/>
            <span class="field-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              Password is required
            </span>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading$ | async">
            <span *ngIf="!(loading$ | async)">Sign In</span>
            <span *ngIf="loading$ | async">Signing in...</span>
          </button>
        </form>

        <p class="auth-link">
          New to StackUp? <a routerLink="/register">Create an account</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 130px);
      padding: 2rem;
    }
    .auth-card {
      background: rgba(15,23,42,0.8);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      backdrop-filter: blur(12px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-icon { font-size: 3rem; margin-bottom: 0.5rem; }
    .auth-header h1 { font-size: 1.8rem; font-weight: 800; color: #f1f5f9; margin-bottom: 0.5rem; }
    .auth-header p { color: #64748b; font-size: 0.95rem; }
    .error-list {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.3);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .error-item { color: #f87171; font-size: 0.875rem; }
    .auth-form { display: flex; flex-direction: column; gap: 1.2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    label { color: #94a3b8; font-size: 0.875rem; font-weight: 500; }
    input {
      background: rgba(30,41,59,0.6);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 8px;
      color: #e2e8f0;
      font-size: 0.95rem;
      padding: 0.75rem 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
    input::placeholder { color: #475569; }
    .field-error { color: #f87171; font-size: 0.8rem; }
    .btn-submit {
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.5rem;
      box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 25px rgba(99,102,241,0.4); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-link { text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 1.5rem; }
    .auth-link a { color: #a78bfa; text-decoration: none; font-weight: 600; }
    .auth-link a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading$: Observable<boolean>;
  errors$: Observable<Record<string, string> | null>;
  objectKeys = Object.keys;

  constructor(private fb: FormBuilder, private store: Store) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.errors$ = this.store.select(selectAuthErrors);
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void { this.store.dispatch(clearErrors()); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { email, password } = this.form.value;
    this.store.dispatch(login({ email, password }));
  }
}
