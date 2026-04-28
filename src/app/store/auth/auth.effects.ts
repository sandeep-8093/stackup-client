import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AuthEffects {
  private api = environment.apiUrl;

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.http.post<{ token: string }>(`${this.api}/api/users/login`, { email, password }).pipe(
          map(res => {
            const token = res.token;
            this.authService.setToken(token);
            const user = this.authService.decodeToken(token);
            return AuthActions.loginSuccess({ token, user });
          }),
          catchError(err =>
            of(AuthActions.loginFailure({ errors: err.error || { message: 'Login failed' } }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ name, email, password, password2 }) =>
        this.http.post(`${this.api}/api/users/register`, { name, email, password, password2 }).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError(err =>
            of(AuthActions.registerFailure({ errors: err.error || { message: 'Registration failed' } }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => this.router.navigate(['/login']))
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.removeToken();
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
