import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'profiles',
    loadComponent: () =>
      import('./components/profiles/profiles.component').then(m => m.ProfilesComponent),
  },
  {
    path: 'profile/:handle',
    loadComponent: () =>
      import('./components/profile/profile.component').then(m => m.ProfileComponent),
    children: [
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./components/profile/profile-posts.component').then(m => m.ProfilePostsComponent)
      },
      {
        path: 'info',
        loadComponent: () =>
          import('./components/profile/profile-info.component').then(m => m.ProfileInfoComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./components/dashboard/dashboard-posts.component').then(m => m.DashboardPostsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/dashboard/dashboard-profile.component').then(m => m.DashboardProfileComponent)
      }
    ]
  },
  {
    path: 'create-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/create-profile/create-profile.component').then(m => m.CreateProfileComponent),
  },
  {
    path: 'edit-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/edit-profile/edit-profile.component').then(m => m.EditProfileComponent),
  },
  {
    path: 'add-experience',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/add-credentials/add-experience.component').then(m => m.AddExperienceComponent),
  },
  {
    path: 'add-education',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/add-credentials/add-education.component').then(m => m.AddEducationComponent),
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/posts/posts.component').then(m => m.PostsComponent),
  },
  {
    path: 'post/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/post/post.component').then(m => m.PostComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
