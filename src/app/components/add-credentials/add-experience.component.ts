import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { addExperience } from '../../store/profile/profile.actions';

@Component({
  selector: 'app-add-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="credentials-page">
      <div class="form-card">
        <a routerLink="/dashboard" class="btn-back">← Go Back</a>
        <h1 class="page-title">Add Experience</h1>
        <p class="page-subtitle">Add any developer/programming positions that you have had in the past</p>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="data-form">
          <div class="form-group">
            <label>* Job Title</label>
            <input type="text" formControlName="title" placeholder="* Job Title">
            <span class="field-error" *ngIf="form.get('title')?.touched && form.get('title')?.invalid">Title is required</span>
          </div>
          
          <div class="form-group">
            <label>* Company</label>
            <input type="text" formControlName="company" placeholder="* Company">
            <span class="field-error" *ngIf="form.get('company')?.touched && form.get('company')?.invalid">Company is required</span>
          </div>
          
          <div class="form-group">
            <label>Location</label>
            <input type="text" formControlName="location" placeholder="Location">
          </div>
          
          <div class="date-group">
            <div class="form-group">
              <label>From Date</label>
              <input type="date" formControlName="from">
            </div>
            <div class="form-group">
              <label>To Date</label>
              <input type="date" formControlName="to" [attr.disabled]="form.get('current')?.value ? true : null">
            </div>
          </div>
          
          <div class="checkbox-group">
            <input type="checkbox" id="current" formControlName="current">
            <label for="current">Current Job</label>
          </div>
          
          <div class="form-group">
            <label>Job Description</label>
            <textarea formControlName="description" placeholder="Program description" rows="3"></textarea>
          </div>
          
          <button type="submit" class="btn-submit">Submit</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .credentials-page { padding: 2rem; display: flex; justify-content: center; }
    .form-card { background: rgba(15,23,42,0.8); border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 600px; position: relative; }
    .btn-back { display: inline-block; margin-bottom: 1rem; color: #a78bfa; text-decoration: none; font-weight: 600; }
    .page-title { color: #f1f5f9; font-size: 2rem; margin-bottom: 0.5rem; }
    .page-subtitle { color: #94a3b8; margin-bottom: 2rem; }
    .data-form { display: flex; flex-direction: column; gap: 1.2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .date-group { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { color: #e2e8f0; font-size: 0.9rem; font-weight: 600; }
    input[type="text"], input[type="date"], textarea { background: rgba(30,41,59,0.6); border: 1px solid rgba(99,102,241,0.2); color: #f1f5f9; padding: 0.8rem; border-radius: 8px; outline: none; }
    input:focus, textarea:focus { border-color: #6366f1; }
    input[disabled] { opacity: 0.5; }
    .checkbox-group { display: flex; align-items: center; gap: 0.5rem; }
    .field-error { color: #f87171; font-size: 0.8rem; }
    .btn-submit { padding: 1rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1.1rem; }
  `]
})
export class AddExperienceComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: [''],
      from: [''],
      to: [''],
      current: [false],
      description: ['']
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.store.dispatch(addExperience({ expData: this.form.value }));
  }
}
