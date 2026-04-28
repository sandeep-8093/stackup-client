import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { register, clearErrors } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthErrors } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join the StackUp developer community</p>
        </div>

        <div class="error-list" *ngIf="errors$ | async as errors">
          <div class="error-item" *ngFor="let key of objectKeys(errors)">
            {{ errors[key] }}
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input id="name" type="text" formControlName="name" placeholder="John Doe" autocomplete="name"/>
            <span class="field-error" *ngIf="form.get('name')?.touched && form.get('name')?.invalid">
              Name is required (2–30 chars)
            </span>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" type="email" formControlName="email" placeholder="john@example.com" autocomplete="email"/>
            <span class="field-error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
              Valid email is required
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" placeholder="Min 6 characters" autocomplete="new-password"/>
            <span class="field-error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
              Password must be at least 6 characters
            </span>
          </div>

          <div class="form-group">
            <label for="password2">Confirm Password</label>
            <input id="password2" type="password" formControlName="password2" placeholder="Repeat password" autocomplete="new-password"/>
            <span class="field-error" *ngIf="form.get('password2')?.touched && form.errors?.['mismatch']">
              Passwords do not match
            </span>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading$ | async">
            <span *ngIf="!(loading$ | async)">Create Account</span>
            <span *ngIf="loading$ | async">Creating...</span>
          </button>
        </form>

        <p class="auth-link">
          Already have an account? <a routerLink="/login">Sign in</a>
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
      max-width: 440px;
      backdrop-filter: blur(12px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-header h1 { font-size: 1.8rem; font-weight: 800; color: #f1f5f9; margin-bottom: 0.5rem; }
    .auth-header p { color: #64748b; font-size: 0.95rem; }
    .error-list {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.3);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .error-item { color: #f87171; font-size: 0.875rem; padding: 0.2rem 0; }
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
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading$: Observable<boolean>;
  errors$: Observable<Record<string, string> | null>;
  objectKeys = Object.keys;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.errors$ = this.store.select(selectAuthErrors);
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void { this.store.dispatch(clearErrors()); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  passwordMatchValidator(g: FormGroup) {
    const pw = g.get('password')?.value;
    const pw2 = g.get('password2')?.value;
    return pw === pw2 ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, email, password, password2 } = this.form.value;
    this.store.dispatch(register({ name, email, password, password2 }));
  }
}
