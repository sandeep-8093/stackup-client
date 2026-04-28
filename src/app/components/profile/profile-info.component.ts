import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectProfile, selectProfileLoading } from '../../store/profile/profile.selectors';
import { Profile } from '../../store/profile/profile.state';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  template: `
    <div class="subpage">

      <div class="subpage-header">
        <h2 class="subpage-title">Personal Information</h2>
        <p class="subpage-sub">Public profile and background</p>
      </div>

      <app-spinner *ngIf="loading$ | async"></app-spinner>

      <ng-container *ngIf="!(loading$ | async)">
        <ng-container *ngIf="profile$ | async as profile; else noProfile">

          <!-- ── Profile Card ──────────────────────────── -->
          <div class="info-card">
            <h3 class="card-title" style="margin-bottom: 1.25rem;">👤 Profile</h3>

            <div class="profile-hero">
              <img *ngIf="profile.user?.avatar"
                   [src]="profile.user?.avatar"
                   [alt]="profile.user?.name"
                   class="profile-avatar"/>
              <div *ngIf="!profile.user?.avatar" class="profile-avatar-placeholder">
                {{ profile.user?.name?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="profile-hero-info">
                <p class="hero-name">{{ profile.user?.name }}</p>
                <p class="hero-handle" *ngIf="profile.handle">&#64;{{ profile.handle }}</p>
                <p class="hero-status" *ngIf="profile.status">{{ profile.status }} <span *ngIf="profile.company">at {{ profile.company }}</span></p>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-item" *ngIf="profile.location">
                <span class="info-label">📍 Location</span>
                <span class="info-value">{{ profile.location }}</span>
              </div>
              <div class="info-item" *ngIf="profile.website">
                <span class="info-label">🌐 Website</span>
                <a [href]="profile.website" target="_blank" class="info-link">{{ profile.website }}</a>
              </div>
              <div class="info-item" *ngIf="profile.githubusername">
                <span class="info-label">🐙 GitHub</span>
                <a [href]="'https://github.com/' + profile.githubusername" target="_blank" class="info-link">{{ profile.githubusername }}</a>
              </div>
              <div class="info-item" *ngIf="profile.yearsOfExperience !== undefined && profile.yearsOfExperience !== null">
                <span class="info-label">⏱ Experience</span>
                <span class="info-value">{{ profile.yearsOfExperience }} Years</span>
              </div>
              <div class="info-item" *ngIf="profile.resumeLink">
                <span class="info-label">📄 Resume</span>
                <a [href]="profile.resumeLink" target="_blank" class="info-link">View Resume</a>
              </div>
            </div>

            <div class="bio-section" *ngIf="profile.bio">
              <span class="info-label">Bio</span>
              <p class="bio-text">{{ profile.bio }}</p>
            </div>

            <div class="skills-section" *ngIf="profile.skills?.length">
              <span class="info-label">🛠 Skills</span>
              <div class="skills-wrap">
                <span class="skill-chip" *ngFor="let s of profile.skills">{{ s }}</span>
              </div>
            </div>

            <div class="skills-section" *ngIf="profile.languages?.length" style="margin-top: 1rem;">
              <span class="info-label">🗣 Languages</span>
              <div class="skills-wrap">
                <span class="skill-chip" *ngFor="let l of profile.languages">{{ l }}</span>
              </div>
            </div>

            <div class="skills-section" *ngIf="profile.interests?.length" style="margin-top: 1rem;">
              <span class="info-label">💡 Interests</span>
              <div class="skills-wrap">
                <span class="skill-chip" *ngFor="let i of profile.interests">{{ i }}</span>
              </div>
            </div>
          </div>

          <!-- ── Experience ────────────────────────────── -->
          <div class="info-card" *ngIf="profile.experience?.length">
            <h3 class="card-title" style="margin-bottom: 1.25rem;">💼 Experience</h3>

            <div class="entry-list">
              <div class="entry-item" *ngFor="let exp of profile.experience">
                <div class="entry-icon">💼</div>
                <div class="entry-info">
                  <p class="entry-title">{{ exp.title }}</p>
                  <p class="entry-sub">{{ exp.company }}</p>
                  <p class="entry-date">
                    {{ exp.from | date:'MMM yyyy' }} –
                    {{ exp.current ? 'Present' : (exp.to | date:'MMM yyyy') }}
                  </p>
                  <p class="entry-desc" *ngIf="exp.description">{{ exp.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Education ─────────────────────────────── -->
          <div class="info-card" *ngIf="profile.education?.length">
            <h3 class="card-title" style="margin-bottom: 1.25rem;">🎓 Education</h3>

            <div class="entry-list">
              <div class="entry-item" *ngFor="let edu of profile.education">
                <div class="entry-icon">🎓</div>
                <div class="entry-info">
                  <p class="entry-title">{{ edu.degree }} in {{ edu.fieldofstudy }}</p>
                  <p class="entry-sub">{{ edu.school }}</p>
                  <p class="entry-date">
                    {{ edu.from | date:'MMM yyyy' }} –
                    {{ edu.current ? 'Present' : (edu.to | date:'MMM yyyy') }}
                  </p>
                  <p class="entry-desc" *ngIf="edu.description">{{ edu.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Social Links ──────────────────────────── -->
          <div class="info-card" *ngIf="hasSocial(profile)">
            <h3 class="card-title" style="margin-bottom:1.25rem">🔗 Social Links</h3>
            <div class="social-grid">
              <a *ngIf="profile.social?.twitter" [href]="profile.social!.twitter" target="_blank" class="social-chip">𝕏 Twitter</a>
              <a *ngIf="profile.social?.linkedin" [href]="profile.social!.linkedin" target="_blank" class="social-chip">in LinkedIn</a>
              <a *ngIf="profile.social?.youtube" [href]="profile.social!.youtube" target="_blank" class="social-chip">▶ YouTube</a>
              <a *ngIf="profile.social?.instagram" [href]="profile.social!.instagram" target="_blank" class="social-chip">📷 Instagram</a>
              <a *ngIf="profile.social?.facebook" [href]="profile.social!.facebook" target="_blank" class="social-chip">f Facebook</a>
            </div>
          </div>

        </ng-container>

        <ng-template #noProfile>
          <div class="no-profile-card">
            <div class="no-profile-icon">👤</div>
            <h2>Profile Not Found</h2>
            <p>This user has not set up a profile yet.</p>
          </div>
        </ng-template>
      </ng-container>
    </div>
  `,
  styles: [`
    .subpage { max-width: 800px; }

    /* ── Header ── */
    .subpage-header { margin-bottom: 2rem; }
    .subpage-title { font-size: 1.6rem; font-weight: 800; color: #f1f5f9; margin: 0 0 0.25rem; }
    .subpage-sub { color: #64748b; font-size: 0.875rem; margin: 0; }

    /* ── Info Cards ── */
    .info-card {
      background: rgba(15,23,42,0.75);
      border: 1px solid rgba(99,102,241,0.13);
      border-radius: 14px;
      padding: 1.5rem 1.75rem;
      margin-bottom: 1.25rem;
      transition: border-color 0.2s;
    }
    .info-card:hover { border-color: rgba(99,102,241,0.25); }
    .card-title { color: #e2e8f0; font-size: 1rem; font-weight: 700; margin: 0; }

    /* Profile hero */
    .profile-hero { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
    .profile-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(99,102,241,0.3); flex-shrink: 0; }
    .profile-avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.4rem; font-weight: 700; flex-shrink: 0; }
    .hero-name { color: #f1f5f9; font-weight: 700; font-size: 1.1rem; margin: 0 0 0.15rem; }
    .hero-handle { color: #6366f1; font-size: 0.85rem; margin: 0 0 0.15rem; }
    .hero-status { color: #64748b; font-size: 0.85rem; margin: 0; }

    /* Info grid */
    .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: 0.2rem; }
    .info-label { color: #475569; font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-value { color: #94a3b8; font-size: 0.9rem; }
    .info-link { color: #60a5fa; font-size: 0.9rem; text-decoration: none; }
    .info-link:hover { text-decoration: underline; }

    /* Bio */
    .bio-section { margin-bottom: 1rem; }
    .bio-text { color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin: 0.3rem 0 0; }

    /* Skills */
    .skills-section { }
    .skills-wrap { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
    .skill-chip { padding: 0.25rem 0.75rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #a78bfa; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }

    /* Entry list (exp/edu) */
    .entry-list { display: flex; flex-direction: column; gap: 0; }
    .entry-item {
      display: flex; align-items: flex-start; gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(99,102,241,0.07);
    }
    .entry-item:last-child { border-bottom: none; padding-bottom: 0; }
    .entry-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 0.1rem; }
    .entry-info { flex: 1; min-width: 0; }
    .entry-title { color: #e2e8f0; font-weight: 700; font-size: 0.95rem; margin: 0 0 0.15rem; }
    .entry-sub { color: #94a3b8; font-size: 0.875rem; margin: 0 0 0.15rem; }
    .entry-date { color: #475569; font-size: 0.78rem; margin: 0 0 0.4rem; }
    .entry-desc { color: #64748b; font-size: 0.85rem; line-height: 1.5; margin: 0; }

    /* Social */
    .social-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .social-chip { padding: 0.4rem 1rem; background: rgba(30,41,59,0.5); border: 1px solid rgba(99,102,241,0.15); color: #94a3b8; border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: all 0.15s; }
    .social-chip:hover { border-color: rgba(99,102,241,0.35); color: #a78bfa; background: rgba(99,102,241,0.08); }

    /* No Profile */
    .no-profile-card { text-align: center; padding: 5rem 2rem; background: rgba(15,23,42,0.5); border: 1px dashed rgba(99,102,241,0.2); border-radius: 16px; }
    .no-profile-icon { font-size: 3rem; margin-bottom: 1rem; }
    .no-profile-card h2 { color: #e2e8f0; margin-bottom: 0.5rem; }
    .no-profile-card p { color: #64748b; margin-bottom: 1.5rem; }
  `]
})
export class ProfileInfoComponent {
  profile$: Observable<Profile | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.profile$ = this.store.select(selectProfile);
    this.loading$ = this.store.select(selectProfileLoading);
  }

  hasSocial(profile: Profile): boolean {
    const s = profile.social;
    return !!(s?.twitter || s?.linkedin || s?.youtube || s?.instagram || s?.facebook);
  }
}
