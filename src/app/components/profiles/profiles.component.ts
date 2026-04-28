import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, BehaviorSubject } from 'rxjs';
import { Profile } from '../../store/profile/profile.state';
import { loadProfiles } from '../../store/profile/profile.actions';
import { selectProfiles, selectProfileLoading } from '../../store/profile/profile.selectors';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SpinnerComponent],
  template: `
    <div class="profiles-page">
      <div class="page-header">
        <h1 class="page-title">Developer Profiles</h1>
        <p class="page-subtitle">Browse and connect with developers</p>

        <!-- Search bar -->
        <div class="search-wrap">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input
              id="profiles-search-input"
              type="text"
              placeholder="Search by name, skill or location…"
              [(ngModel)]="filterQuery"
              (ngModelChange)="onFilterChange($event)"
            />
            <button *ngIf="filterQuery" class="clear-btn" (click)="clearFilter()">✕</button>
          </div>
          <span class="result-count" *ngIf="filterQuery">
            {{ (filteredProfiles$ | async)?.length || 0 }} result(s)
          </span>
        </div>
      </div>

      <app-spinner *ngIf="loading$ | async"></app-spinner>

      <div class="profiles-grid" *ngIf="!(loading$ | async)">
        <ng-container *ngIf="(filteredProfiles$ | async)?.length; else noProfiles">
          <div class="profile-card" *ngFor="let profile of (filteredProfiles$ | async)">
            <div class="profile-avatar">
              <img [src]="profile.user?.avatar" alt="Avatar" *ngIf="profile.user?.avatar; else defaultAvatar">
              <ng-template #defaultAvatar>
                <div class="placeholder-avatar">👤</div>
              </ng-template>
            </div>

            <div class="profile-info">
              <h2>{{ profile.user?.name }}</h2>
              <p class="status">{{ profile.status }} <span *ngIf="profile.company">at {{ profile.company }}</span></p>
              <p class="location" *ngIf="profile.location">{{ profile.location }}</p>
              <a [routerLink]="['/profile', profile.handle]" class="btn-view">View Profile</a>
            </div>

            <div class="profile-skills">
              <h4>Skill Set</h4>
              <ul>
                <li *ngFor="let skill of profile.skills | slice:0:4"><span class="check">✓</span> {{ skill }}</li>
              </ul>
            </div>
          </div>
        </ng-container>

        <ng-template #noProfiles>
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <p *ngIf="filterQuery">No developers match "<strong>{{ filterQuery }}</strong>"</p>
            <p *ngIf="!filterQuery">No profiles found...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .profiles-page { max-width: 1000px; margin: 0 auto; padding: 3rem 2rem; }
    .page-header { text-align: center; margin-bottom: 3rem; }
    .page-title { font-size: 2.5rem; font-weight: 800; color: #f1f5f9; margin-bottom: 0.5rem; }
    .page-subtitle { color: #94a3b8; font-size: 1.1rem; margin-bottom: 2rem; }

    /* Search */
    .search-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
    .search-bar {
      display: flex; align-items: center; gap: 0.75rem;
      background: rgba(15,23,42,0.8); border: 1px solid rgba(99,102,241,0.25);
      border-radius: 30px; padding: 0.65rem 1.2rem;
      width: 100%; max-width: 520px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-bar:focus-within {
      border-color: rgba(99,102,241,0.5);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    }
    .search-icon { font-size: 1rem; color: #64748b; flex-shrink: 0; }
    .search-bar input {
      background: none; border: none; outline: none;
      color: #e2e8f0; font-size: 0.95rem; width: 100%; font-family: inherit;
    }
    .search-bar input::placeholder { color: #475569; }
    .clear-btn {
      background: none; border: none; color: #475569; cursor: pointer;
      font-size: 0.8rem; padding: 0.15rem 0.3rem; border-radius: 4px;
      transition: color 0.15s;
    }
    .clear-btn:hover { color: #f87171; }
    .result-count { font-size: 0.82rem; color: #64748b; }

    /* Grid */
    .profiles-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .profile-card {
      background: rgba(15,23,42,0.6);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 12px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .profile-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-color: rgba(99,102,241,0.4); }
    .profile-avatar { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; background: #1e293b; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(99,102,241,0.3); flex-shrink: 0; }
    .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder-avatar { font-size: 4rem; }
    .profile-info { flex: 1; }
    .profile-info h2 { color: #e2e8f0; font-size: 1.5rem; margin-bottom: 0.3rem; }
    .status { color: #f1f5f9; font-size: 1rem; margin-bottom: 0.3rem; }
    .location { color: #64748b; font-size: 0.9rem; margin-bottom: 1rem; }
    .btn-view { display: inline-block; padding: 0.5rem 1.2rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .profile-skills { width: 250px; background: rgba(30,41,59,0.5); padding: 1.2rem; border-radius: 8px; flex-shrink: 0; }
    .profile-skills h4 { color: #94a3b8; margin-bottom: 0.8rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .profile-skills ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
    .profile-skills li { color: #cbd5e1; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; }
    .check { color: #10b981; font-weight: bold; }
    .empty-state { text-align: center; color: #94a3b8; padding: 3rem; font-size: 1.1rem; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-state strong { color: #a78bfa; }
    @media (max-width: 768px) {
      .profile-card { flex-direction: column; text-align: center; }
      .profile-info { align-items: center; display: flex; flex-direction: column; }
      .profile-skills { width: 100%; text-align: left; }
    }
  `]
})
export class ProfilesComponent implements OnInit {
  profiles$: Observable<Profile[]>;
  loading$: Observable<boolean>;
  filteredProfiles$: Observable<Profile[]>;

  filterQuery = '';
  private filterSubject = new BehaviorSubject<string>('');

  constructor(private store: Store, private route: ActivatedRoute) {
    this.profiles$ = this.store.select(selectProfiles);
    this.loading$ = this.store.select(selectProfileLoading);

    this.filteredProfiles$ = combineLatest([
      this.profiles$,
      this.filterSubject.asObservable()
    ]).pipe(
      map(([profiles, query]) => {
        if (!query.trim()) return profiles;
        const q = query.toLowerCase();
        return profiles.filter(p =>
          p.user?.name?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.skills?.some(s => s.toLowerCase().includes(q)) ||
          p.status?.toLowerCase().includes(q) ||
          p.company?.toLowerCase().includes(q)
        );
      })
    );
  }

  ngOnInit() {
    this.store.dispatch(loadProfiles());
    // Pick up ?search= from URL (e.g. from navbar global search)
    const q = this.route.snapshot.queryParamMap.get('search');
    if (q) {
      this.filterQuery = q;
      this.filterSubject.next(q);
    }
  }

  onFilterChange(value: string): void {
    this.filterSubject.next(value);
  }

  clearFilter(): void {
    this.filterQuery = '';
    this.filterSubject.next('');
  }
}
