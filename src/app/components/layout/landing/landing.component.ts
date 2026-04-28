import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="landing">
      <div class="landing-bg"></div>
      <div class="landing-content">
        <div class="badge">Developer Network</div>
        <h1 class="landing-title">
          Connect, Share &amp; Grow<br/>
          <span class="gradient-text">Your Developer Career</span>
        </h1>
        <p class="landing-subtitle">
          Build your developer profile, showcase your skills, and connect with
          talented engineers worldwide. Share experiences, give feedback, and grow together.
        </p>
        <div class="cta-group">
          <a routerLink="/register" class="btn-primary">Get Started Free</a>
          <a routerLink="/profiles" class="btn-secondary">Browse Developers</a>
        </div>
        <div class="stats">
          <div class="stat"><span class="stat-num">10k+</span><span class="stat-label">Developers</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">50k+</span><span class="stat-label">Posts</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">100+</span><span class="stat-label">Skills Shared</span></div>
        </div>
      </div>
      <div class="landing-visual">
        <div class="code-card">
          <div class="card-header">
            <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
          </div>
          <pre class="code-block"><code><span class="kw">const</span> developer = &#123;
  name: <span class="str">"You"</span>,
  skills: [<span class="str">"Angular"</span>, <span class="str">"NgRx"</span>],
  passion: <span class="str">"building things"</span>,
  open: <span class="kw">true</span>
&#125;;

<span class="kw">export default</span> developer;</code></pre>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .landing {
      min-height: calc(100vh - 130px);
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
      gap: 4rem;
      position: relative;
    }
    .landing-bg {
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(99,102,241,0.15) 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    }
    .landing-content { position: relative; z-index: 1; }
    .badge {
      display: inline-block;
      padding: 0.35rem 1rem;
      background: rgba(99,102,241,0.15);
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: 20px;
      color: #a78bfa;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }
    .landing-title {
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 800;
      line-height: 1.15;
      color: #f1f5f9;
      margin-bottom: 1.5rem;
    }
    .gradient-text {
      background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .landing-subtitle {
      color: #94a3b8;
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 2.5rem;
      max-width: 480px;
    }
    .cta-group { display: flex; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      padding: 0.875rem 2rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 1rem;
      transition: all 0.2s;
      box-shadow: 0 4px 20px rgba(99,102,241,0.4);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.5); }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      padding: 0.875rem 2rem;
      border: 1px solid rgba(99,102,241,0.4);
      color: #a78bfa;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.2s;
    }
    .btn-secondary:hover { background: rgba(99,102,241,0.1); border-color: #6366f1; }
    .stats { display: flex; align-items: center; gap: 2rem; }
    .stat { display: flex; flex-direction: column; }
    .stat-num { font-size: 1.6rem; font-weight: 800; color: #e2e8f0; }
    .stat-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }
    .stat-divider { width: 1px; height: 40px; background: rgba(99,102,241,0.2); }
    .landing-visual { position: relative; z-index: 1; }
    .code-card {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
      backdrop-filter: blur(10px);
    }
    .card-header {
      display: flex;
      gap: 0.5rem;
      padding: 1rem 1.2rem;
      background: rgba(99,102,241,0.08);
      border-bottom: 1px solid rgba(99,102,241,0.15);
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot.red { background: #f87171; }
    .dot.yellow { background: #fbbf24; }
    .dot.green { background: #34d399; }
    .code-block { margin: 0; padding: 2rem; font-family: 'Fira Code', monospace; font-size: 0.9rem; line-height: 1.8; color: #94a3b8; }
    .kw { color: #a78bfa; }
    .str { color: #34d399; }
    @media (max-width: 768px) {
      .landing { grid-template-columns: 1fr; }
      .landing-visual { display: none; }
    }
  `]
})
export class LandingComponent {}
