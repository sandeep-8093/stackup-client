import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as ProfileActions from './profile.actions';
import * as AuthActions from '../auth/auth.actions';
import { Profile } from './profile.state';

@Injectable()
export class ProfileEffects {
  private api = environment.apiUrl;

  loadMyProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadMyProfile),
      switchMap(() =>
        this.http.get<Profile>(`${this.api}/api/profile`).pipe(
          map(profile => ProfileActions.loadMyProfileSuccess({ profile })),
          catchError(err => of(ProfileActions.loadMyProfileFailure({ error: err.error?.message || 'Failed to load profile' })))
        )
      )
    )
  );

  loadProfiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfiles),
      switchMap(() =>
        this.http.get<Profile[]>(`${this.api}/api/profile/all`).pipe(
          map(profiles => ProfileActions.loadProfilesSuccess({ profiles })),
          catchError(err => of(ProfileActions.loadProfilesFailure({ error: err.error?.message || 'Failed to load profiles' })))
        )
      )
    )
  );

  loadProfileByHandle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfileByHandle),
      switchMap(({ handle }) =>
        this.http.get<Profile>(`${this.api}/api/profile/handle/${handle}`).pipe(
          map(profile => ProfileActions.loadProfileByHandleSuccess({ profile })),
          catchError(err => of(ProfileActions.loadProfileByHandleFailure({ error: err.error?.message || 'Profile not found' })))
        )
      )
    )
  );

  loadProfileByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfileByUserId),
      switchMap(({ id }) =>
        this.http.get<Profile>(`${this.api}/api/profile/user/${id}`).pipe(
          map(profile => ProfileActions.loadProfileByUserIdSuccess({ profile })),
          catchError(err => of(ProfileActions.loadProfileByUserIdFailure({ error: err.error?.message || 'Profile not found' })))
        )
      )
    )
  );

  createProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.createProfile),
      switchMap(({ profileData, redirect }) =>
        this.http.post<Profile>(`${this.api}/api/profile`, profileData).pipe(
          map(profile => ProfileActions.createProfileSuccess({ profile })),
          catchError(err => of(ProfileActions.createProfileFailure({ error: err.error?.message || 'Failed to save profile' })))
        )
      )
    )
  );

  createProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.createProfileSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ),
    { dispatch: false }
  );

  addExperience$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.addExperience),
      switchMap(({ expData }) =>
        this.http.post<Profile>(`${this.api}/api/profile/experience`, expData).pipe(
          map(profile => ProfileActions.addExperienceSuccess({ profile })),
          catchError(err => of(ProfileActions.createProfileFailure({ error: err.error?.message || 'Failed to add experience' })))
        )
      )
    )
  );

  addExperienceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.addExperienceSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ),
    { dispatch: false }
  );

  deleteExperience$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.deleteExperience),
      switchMap(({ id }) =>
        this.http.delete<Profile>(`${this.api}/api/profile/experience/${id}`).pipe(
          map(profile => ProfileActions.deleteExperienceSuccess({ profile })),
          catchError(err => of(ProfileActions.createProfileFailure({ error: err.error?.message || 'Failed to delete experience' })))
        )
      )
    )
  );

  addEducation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.addEducation),
      switchMap(({ eduData }) =>
        this.http.post<Profile>(`${this.api}/api/profile/education`, eduData).pipe(
          map(profile => ProfileActions.addEducationSuccess({ profile })),
          catchError(err => of(ProfileActions.createProfileFailure({ error: err.error?.message || 'Failed to add education' })))
        )
      )
    )
  );

  addEducationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.addEducationSuccess),
      tap(() => this.router.navigate(['/dashboard']))
    ),
    { dispatch: false }
  );

  deleteEducation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.deleteEducation),
      switchMap(({ id }) =>
        this.http.delete<Profile>(`${this.api}/api/profile/education/${id}`).pipe(
          map(profile => ProfileActions.deleteEducationSuccess({ profile })),
          catchError(err => of(ProfileActions.createProfileFailure({ error: err.error?.message || 'Failed to delete education' })))
        )
      )
    )
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.deleteAccount),
      switchMap(() =>
        this.http.delete(`${this.api}/api/profile`).pipe(
          map(() => ProfileActions.deleteAccountSuccess()),
          catchError(err => of(ProfileActions.createProfileFailure({ error: err.error?.message || 'Failed to delete account' })))
        )
      )
    )
  );

  deleteAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.deleteAccountSuccess),
      tap(() => {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/login']);
      }),
      map(() => AuthActions.logout())
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
