import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Profile } from '../../store/profile/profile.state';
import { loadProfileByHandle, loadProfileByUserId } from '../../store/profile/profile.actions';
import { selectProfile, selectProfileLoading } from '../../store/profile/profile.selectors';
import { loadUserPosts } from '../../store/post/post.actions';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-profile-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, SpinnerComponent],
  template: `
    <div class="dash-layout">
      <!-- ── Sidebar Nav ───────────────────────── -->
      <aside class="dash-sidebar">
        <div class="dash-brand">
          <span class="brand-icon">👤</span>
          <span class="brand-text">Profile</span>
        </div>

        <nav class="dash-nav">
          <a routerLink="posts" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📝</span>
            <span class="nav-label">Posts</span>
          </a>
          <a routerLink="info" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">ℹ️</span>
            <span class="nav-label">Personal Info</span>
          </a>
        </nav>

        <div class="dash-sidebar-footer">
          <a routerLink="/profiles" class="nav-item secondary">
            <span class="nav-icon">←</span>
            <span class="nav-label">Back to Profiles</span>
          </a>
        </div>
      </aside>

      <!-- ── Main Content ──────────────────────── -->
      <main class="dash-content">
        <app-spinner *ngIf="loading$ | async"></app-spinner>
        <router-outlet *ngIf="!(loading$ | async)"></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dash-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: calc(100vh - 64px);
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      gap: 2rem;
      align-items: start;
    }
    @media (max-width: 700px) {
      .dash-layout { grid-template-columns: 1fr; }
      .dash-sidebar { position: static; flex-direction: row; }
      .dash-nav { flex-direction: row; flex-wrap: wrap; }
    }

    /* ── Sidebar ── */
    .dash-sidebar {
      position: sticky;
      top: 80px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: rgba(15,23,42,0.85);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 14px;
      padding: 1.5rem 1rem;
      backdrop-filter: blur(12px);
    }
    .dash-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0 0.5rem 1.25rem;
      border-bottom: 1px solid rgba(99,102,241,0.12);
      margin-bottom: 0.5rem;
    }
    .brand-icon { font-size: 1.4rem; }
    .brand-text { color: #e2e8f0; font-size: 1rem; font-weight: 800; letter-spacing: -0.01em; }

    .dash-nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
    .dash-sidebar-footer { border-top: 1px solid rgba(99,102,241,0.1); padding-top: 0.75rem; margin-top: 0.5rem; }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 0.85rem;
      border-radius: 10px;
      color: #64748b;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.15s;
      cursor: pointer;
    }
    .nav-item:hover { background: rgba(99,102,241,0.08); color: #e2e8f0; }
    .nav-item.active { background: rgba(99,102,241,0.15); color: #a78bfa; }
    .nav-item.active .nav-icon { filter: none; }
    .nav-item.secondary { color: #475569; }
    .nav-item.secondary:hover { color: #94a3b8; background: rgba(255,255,255,0.04); }
    .nav-icon { font-size: 1.1rem; flex-shrink: 0; }
    .nav-label { flex: 1; }

    /* ── Main Content ── */
    .dash-content { min-width: 0; }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile$: Observable<Profile | null>;
  loading$: Observable<boolean>;
  private sub = new Subscription();

  constructor(private store: Store, private route: ActivatedRoute) {
    this.profile$ = this.store.select(selectProfile);
    this.loading$ = this.store.select(selectProfileLoading);
  }

  ngOnInit() {
    this.sub.add(
      this.route.paramMap.subscribe(params => {
        const handleOrId = params.get('handle');
        if (handleOrId) {
          if (/^[0-9a-fA-F]{24}$/.test(handleOrId)) {
            this.store.dispatch(loadProfileByUserId({ id: handleOrId }));
          } else {
            this.store.dispatch(loadProfileByHandle({ handle: handleOrId }));
          }
        }
      })
    );

    this.sub.add(
      this.profile$.pipe(
        filter(profile => !!profile && !!profile.user),
        distinctUntilChanged((a, b) => a?._id === b?._id)
      ).subscribe(profile => {
        const userId = (profile!.user as any)?._id;
        if (userId) {
          this.store.dispatch(loadUserPosts({ userId }));
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
