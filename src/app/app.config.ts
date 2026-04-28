import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { profileReducer } from './store/profile/profile.reducer';
import { postReducer } from './store/post/post.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { ProfileEffects } from './store/profile/profile.effects';
import { PostEffects } from './store/post/post.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      auth: authReducer,
      profile: profileReducer,
      post: postReducer,
    }),
    provideEffects([AuthEffects, ProfileEffects, PostEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};
