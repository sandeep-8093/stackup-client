import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { createProfile, loadMyProfile } from '../../store/profile/profile.actions';
import { selectProfile, selectProfileLoading, selectProfileError } from '../../store/profile/profile.selectors';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="profile-page">
      <div class="form-card">
        <div class="form-header">
          <a routerLink="/dashboard" class="btn-back">← Back</a>
          <h1>Edit Profile</h1>
          <p>Update your details below</p>
        </div>

        <div class="error-msg" *ngIf="error$ | async as error">
          {{ error }}
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="data-form">
          <div class="form-group">
            <label>* Professional Status</label>
            <select formControlName="status">
              <option value="" disabled>* Select Professional Status</option>
              <option value="Developer">Developer</option>
              <option value="Junior Developer">Junior Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Manager">Manager</option>
              <option value="Student or Learning">Student or Learning</option>
              <option value="Instructor or Teacher">Instructor or Teacher</option>
              <option value="Intern">Intern</option>
              <option value="Other">Other</option>
            </select>
            <div class="field-hint">Give us an idea of where you are at in your career</div>
          </div>

          <div class="form-group">
            <label>* Profile Handle</label>
            <input type="text" formControlName="handle" placeholder="A unique handle for your profile URL">
            <span class="field-error" *ngIf="form.get('handle')?.touched && form.get('handle')?.invalid">Handle is required</span>
          </div>

          <div class="form-group">
            <label>Company</label>
            <input type="text" formControlName="company" placeholder="Company">
          </div>

          <div class="form-group">
            <label>Website</label>
            <input type="text" formControlName="website" placeholder="Personal or company website">
          </div>

          <div class="form-group">
            <label>Location</label>
            <input type="text" formControlName="location" placeholder="City & state suggested (eg. Boston, MA)">
          </div>

          <div class="form-group">
            <label>* Skills</label>
            <input type="text" formControlName="skills" placeholder="Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)">
            <span class="field-error" *ngIf="form.get('skills')?.touched && form.get('skills')?.invalid">Skills are required</span>
          </div>

          <div class="form-group">
            <label>Github Username</label>
            <input type="text" formControlName="githubusername" placeholder="If you want your latest repos and a Github link, include your username">
          </div>

          <div class="form-group">
            <label>Years of Experience</label>
            <input type="number" formControlName="yearsOfExperience" min="0" placeholder="e.g., 3">
          </div>

          <div class="form-group">
            <label>Interests</label>
            <input type="text" formControlName="interests" placeholder="Comma separated values (e.g., Machine Learning, Web3, UI/UX)">
          </div>

          <div class="form-group">
            <label>Languages</label>
            <input type="text" formControlName="languages" placeholder="Comma separated values (e.g., English, Spanish, Hindi)">
          </div>

          <div class="form-group">
            <label>Resume Link</label>
            <input type="text" formControlName="resumeLink" placeholder="URL to your PDF resume">
          </div>

          <div class="form-group">
            <label>Short Bio</label>
            <textarea formControlName="bio" placeholder="Tell us a little about yourself" rows="3"></textarea>
          </div>

          <div class="social-toggle">
            <button type="button" class="btn-secondary" (click)="displaySocialInputs = !displaySocialInputs">
              Add Social Network Links
            </button>
            <span class="optional-text">Optional</span>
          </div>

          <div *ngIf="displaySocialInputs" class="social-inputs">
            <div class="form-group input-group">
              <span class="input-group-addon">T</span>
              <input type="text" formControlName="twitter" placeholder="Twitter Profile URL">
            </div>
            <div class="form-group input-group">
              <span class="input-group-addon">F</span>
              <input type="text" formControlName="facebook" placeholder="Facebook Profile URL">
            </div>
            <div class="form-group input-group">
              <span class="input-group-addon">Y</span>
              <input type="text" formControlName="youtube" placeholder="YouTube Profile URL">
            </div>
            <div class="form-group input-group">
              <span class="input-group-addon">L</span>
              <input type="text" formControlName="linkedin" placeholder="Linkedin Profile URL">
            </div>
            <div class="form-group input-group">
              <span class="input-group-addon">I</span>
              <input type="text" formControlName="instagram" placeholder="Instagram Profile URL">
            </div>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading$ | async">
            <span *ngIf="!(loading$ | async)">Submit Changes</span>
            <span *ngIf="loading$ | async">Submitting...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { padding: 2rem; display: flex; justify-content: center; }
    .form-card { background: rgba(15,23,42,0.8); border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 700px; }
    .form-header { margin-bottom: 2rem; text-align: center; position: relative; }
    .form-header h1 { color: #f1f5f9; font-size: 2rem; margin-bottom: 0.5rem; }
    .form-header p { color: #94a3b8; }
    .btn-back { position: absolute; left: 0; top: 0.5rem; color: #a78bfa; text-decoration: none; font-weight: 600; }
    .data-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    label { color: #e2e8f0; font-size: 0.9rem; font-weight: 600; }
    input, select, textarea { background: rgba(30,41,59,0.6); border: 1px solid rgba(99,102,241,0.2); color: #f1f5f9; padding: 0.8rem; border-radius: 8px; outline: none; }
    input:focus, select:focus, textarea:focus { border-color: #6366f1; }
    .field-hint { font-size: 0.8rem; color: #64748b; }
    .field-error { color: #f87171; font-size: 0.8rem; }
    .error-msg { background: rgba(239,68,68,0.1); color: #f87171; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: center; }
    .social-toggle { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; }
    .btn-secondary { padding: 0.6rem 1.2rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); color: #a78bfa; border-radius: 8px; cursor: pointer; }
    .optional-text { color: #64748b; font-size: 0.9rem; }
    .social-inputs { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
    .input-group { flex-direction: row; align-items: center; }
    .input-group-addon { background: rgba(30,41,59,0.8); padding: 0.8rem 1.2rem; border-radius: 8px 0 0 8px; border: 1px solid rgba(99,102,241,0.2); border-right: none; color: #94a3b8; font-weight: bold; }
    .input-group input { border-radius: 0 8px 8px 0; flex: 1; }
    .btn-submit { padding: 1rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1.1rem; margin-top: 1rem; }
  `]
})
export class EditProfileComponent implements OnInit {
  form: FormGroup;
  displaySocialInputs = false;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.loading$ = this.store.select(selectProfileLoading);
    this.error$ = this.store.select(selectProfileError);
    this.form = this.fb.group({
      handle: ['', Validators.required],
      company: [''],
      website: [''],
      location: [''],
      status: ['', Validators.required],
      skills: ['', Validators.required],
      githubusername: [''],
      yearsOfExperience: [null],
      interests: [''],
      languages: [''],
      resumeLink: [''],
      bio: [''],
      twitter: [''],
      facebook: [''],
      linkedin: [''],
      youtube: [''],
      instagram: ['']
    });
  }

  ngOnInit() {
    this.store.dispatch(loadMyProfile());
    this.store.select(selectProfile).subscribe(profile => {
      if (profile) {
        let skillsCSV = Array.isArray(profile.skills) ? profile.skills.join(',') : profile.skills;
        let interestsCSV = Array.isArray(profile.interests) ? profile.interests.join(', ') : (profile.interests || '');
        let langsCSV = Array.isArray(profile.languages) ? profile.languages.join(', ') : (profile.languages || '');
        this.form.patchValue({
          handle: profile.handle,
          company: profile.company || '',
          website: profile.website || '',
          location: profile.location || '',
          status: profile.status,
          skills: skillsCSV,
          githubusername: profile.githubusername || '',
          yearsOfExperience: profile.yearsOfExperience || null,
          interests: interestsCSV,
          languages: langsCSV,
          resumeLink: profile.resumeLink || '',
          bio: profile.bio || '',
          twitter: profile.social?.twitter || '',
          facebook: profile.social?.facebook || '',
          linkedin: profile.social?.linkedin || '',
          youtube: profile.social?.youtube || '',
          instagram: profile.social?.instagram || '',
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    
    const formValue = this.form.value;
    const profileData: any = {
      handle: formValue.handle,
      company: formValue.company,
      website: formValue.website,
      location: formValue.location,
      status: formValue.status,
      skills: formValue.skills,
      githubusername: formValue.githubusername,
      yearsOfExperience: formValue.yearsOfExperience,
      interests: formValue.interests,
      languages: formValue.languages,
      resumeLink: formValue.resumeLink,
      bio: formValue.bio,
    };
    
    if (formValue.twitter || formValue.facebook || formValue.linkedin || formValue.youtube || formValue.instagram) {
      profileData.social = {
        twitter: formValue.twitter,
        facebook: formValue.facebook,
        linkedin: formValue.linkedin,
        youtube: formValue.youtube,
        instagram: formValue.instagram
      };
    }

    this.store.dispatch(createProfile({ profileData, redirect: true }));
  }
}
