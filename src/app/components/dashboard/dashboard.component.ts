import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="dash-layout">

      <!-- ── Sidebar Nav ───────────────────────── -->
      <aside class="dash-sidebar">
        <div class="dash-brand">
          <span class="brand-icon">⚡</span>
          <span class="brand-text">Dashboard</span>
        </div>

        <nav class="dash-nav">
          <a routerLink="posts" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📝</span>
            <span class="nav-label">My Posts</span>
          </a>
          <a routerLink="profile" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👤</span>
            <span class="nav-label">Personal Info</span>
          </a>
        </nav>

        <div class="dash-sidebar-footer">
          <a routerLink="/feed" class="nav-item secondary">
            <span class="nav-icon">🌐</span>
            <span class="nav-label">Back to Feed</span>
          </a>
        </div>
      </aside>

      <!-- ── Main Content ──────────────────────── -->
      <main class="dash-content">
        <router-outlet></router-outlet>
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
export class DashboardComponent {}
