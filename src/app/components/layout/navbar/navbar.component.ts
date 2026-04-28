import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated, selectCurrentUser } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';
import { clearProfile } from '../../../store/profile/profile.actions';
import { AuthUser } from '../../../store/auth/auth.state';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a class="nav-brand" routerLink="/">
          <span class="brand-icon">⚡</span>
          <span class="brand-text">StackUp</span>
        </a>

        <ul class="nav-links">
          <li><a routerLink="/profiles" routerLinkActive="active">Developers</a></li>
          <ng-container *ngIf="isAuthenticated$ | async; else guestLinks">
            <li><a routerLink="/feed" routerLinkActive="active">Feed</a></li>
            <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
            <li>
              <button class="btn-logout" (click)="onLogout()">
                <span>Logout</span>
              </button>
            </li>
          </ng-container>
          <ng-template #guestLinks>
            <li><a routerLink="/register" routerLinkActive="active">Register</a></li>
            <li><a routerLink="/login" routerLinkActive="active" class="btn-login">Login</a></li>
          </ng-template>
        </ul>

        <!-- ── Global Search ───────────────────────────── -->
        <div class="global-search" [class.open]="searchOpen" id="global-search-bar">
          <ng-container *ngIf="searchOpen">
            <div class="search-mode-toggle">
              <button
                id="search-mode-posts"
                class="mode-btn"
                [class.active]="searchMode === 'posts'"
                (click)="searchMode = 'posts'">
                Posts
              </button>
              <button
                id="search-mode-devs"
                class="mode-btn"
                [class.active]="searchMode === 'devs'"
                (click)="searchMode = 'devs'">
                Devs
              </button>
            </div>
            <input
              #searchInput
              id="global-search-input"
              class="search-input"
              type="text"
              [placeholder]="searchMode === 'posts' ? 'Search posts & authors…' : 'Search developers…'"
              [(ngModel)]="searchQuery"
              (keydown.enter)="onSearchSubmit()"
              (keydown.escape)="closeSearch()"
            />
          </ng-container>
          <button
            id="global-search-toggle-btn"
            class="search-icon-btn"
            (click)="toggleSearch()"
            [title]="searchOpen ? 'Search' : 'Open search'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.2"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(10, 14, 26, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 0 2rem;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      gap: 1.5rem;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-weight: 700;
      font-size: 1.4rem;
      flex-shrink: 0;
    }
    .brand-icon { font-size: 1.6rem; }
    .brand-text {
      background: linear-gradient(135deg, #6366f1 0%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
    }
    .nav-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: color 0.2s;
      position: relative;
    }
    .nav-links a:hover, .nav-links a.active { color: #e2e8f0; }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #6366f1, #a78bfa);
      border-radius: 1px;
    }
    .btn-login {
      background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
      color: white !important;
      padding: 0.5rem 1.2rem;
      border-radius: 8px;
      font-weight: 600 !important;
    }
    .btn-logout {
      background: none;
      border: 1px solid rgba(99,102,241,0.4);
      color: #94a3b8;
      cursor: pointer;
      padding: 0.4rem 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-logout:hover { border-color: #6366f1; color: #e2e8f0; }

    /* ── Global Search ──────────────────────────────────── */
    .global-search {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(30,41,59,0.7);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 30px;
      padding: 0.35rem 0.5rem 0.35rem 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }
    .global-search.open {
      border-color: rgba(99,102,241,0.5);
      background: rgba(10,14,26,0.98);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12), 0 4px 24px rgba(0,0,0,0.4);
    }

    .search-input {
      background: none;
      border: none;
      outline: none;
      color: #e2e8f0;
      font-size: 0.9rem;
      width: 190px;
      font-family: inherit;
      animation: slideIn 0.25s ease;
    }
    .search-input::placeholder { color: #475569; }
    @keyframes slideIn {
      from { width: 0; opacity: 0; }
      to   { width: 190px; opacity: 1; }
    }

    .search-icon-btn {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.3rem;
      border-radius: 50%;
      transition: color 0.2s, background 0.2s;
      flex-shrink: 0;
    }
    .search-icon-btn:hover { color: #a78bfa; background: rgba(99,102,241,0.1); }
    .global-search.open .search-icon-btn { color: #6366f1; }

    /* Mode toggle pills */
    .search-mode-toggle {
      display: flex;
      gap: 2px;
      background: rgba(15,23,42,0.8);
      border-radius: 20px;
      padding: 2px;
      border: 1px solid rgba(99,102,241,0.15);
      flex-shrink: 0;
    }
    .mode-btn {
      background: none;
      border: none;
      color: #64748b;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.2rem 0.65rem;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.15s;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .mode-btn.active {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
    }
    .mode-btn:not(.active):hover { color: #a78bfa; }
  `]
})
export class NavbarComponent {
  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<AuthUser | null>;

  searchOpen = false;
  searchMode: 'posts' | 'devs' = 'posts';
  searchQuery = '';

  constructor(private store: Store, private router: Router) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  toggleSearch(): void {
    if (!this.searchOpen) {
      this.searchOpen = true;
      // Focus after Angular renders the input
      setTimeout(() => this.searchInputRef?.nativeElement?.focus(), 50);
    } else {
      this.onSearchSubmit();
    }
  }

  closeSearch(): void {
    this.searchOpen = false;
    this.searchQuery = '';
  }

  onSearchSubmit(): void {
    const q = this.searchQuery.trim();
    if (!q) {
      this.closeSearch();
      return;
    }
    if (this.searchMode === 'posts') {
      this.router.navigate(['/feed'], { queryParams: { search: q } });
    } else {
      this.router.navigate(['/profiles'], { queryParams: { search: q } });
    }
    this.closeSearch();
  }

  onLogout(): void {
    this.store.dispatch(logout());
    this.store.dispatch(clearProfile());
  }
}
