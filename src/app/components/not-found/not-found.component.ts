import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-page">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Page Not Found</h2>
        <p class="error-desc">Sorry, this page does not exist or has been moved.</p>
        <a routerLink="/" class="btn-primary">Return Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 130px);
      padding: 2rem;
    }
    .not-found-content {
      text-align: center;
    }
    .error-code {
      font-size: 8rem;
      font-weight: 900;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 1rem;
    }
    .error-title {
      font-size: 2rem;
      color: #f1f5f9;
      margin-bottom: 0.5rem;
    }
    .error-desc {
      color: #94a3b8;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    .btn-primary {
      display: inline-block;
      padding: 0.8rem 2rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      transition: transform 0.2s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent {}
