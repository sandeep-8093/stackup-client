import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <span class="footer-brand">⚡ StackUp</span>
        <span class="footer-text">Connect with Developers Worldwide</span>
        <span class="footer-copy">&copy; {{ year }} StackUp</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: rgba(10, 14, 26, 0.95);
      border-top: 1px solid rgba(99, 102, 241, 0.15);
      padding: 1.5rem 2rem;
      text-align: center;
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .footer-brand {
      font-weight: 700;
      font-size: 1.1rem;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .footer-text, .footer-copy { color: #475569; font-size: 0.875rem; }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
