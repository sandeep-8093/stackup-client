import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { AuthService } from './core/services/auth.service';
import { setCurrentUser, logout } from './store/auth/auth.actions';
import { clearProfile } from './store/profile/profile.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 130px);
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      if (this.authService.isTokenExpired(token)) {
        this.store.dispatch(logout());
        this.store.dispatch(clearProfile());
      } else {
        const user = this.authService.decodeToken(token);
        this.store.dispatch(setCurrentUser({ user }));
      }
    }
  }
}
